import * as fs from "fs";
import {Package} from "p0x0/package";
import {Platform} from "p0x0/platform";
import {EnvGenerator} from "p0x0gen/generator/env/env.generator";
import * as path from "path";

import {CARDINALS, Entity} from "p0x0/entity";
import {Environment} from "p0x0/environment";
import {sourceFactory} from "p0x0res";
import {p0x0source} from "p0x0res/source";
import {Utils} from "utils/utils";
import {p0x0genConfig} from "./config/config";
import * as generators from "./generator";
import {p0x0generator} from "./generator";
import {ip0x0genGeneratorConfig} from "./generator/generator";

enum LoadableType {ENTITY = "entity", IMPLEMENTATION = "ID", RESOURCE = "RES"}

export class p0x0gen {
    protected baseAppSourcesPath;
    protected config: p0x0genConfig;
    protected generators: p0x0generator[] = [];
    protected sources: p0x0source[] = [];

    constructor(
        protected configFile: string) {}

    get output() {
        return this.config.output;
    }

    public run(): Promise<boolean> {
        return this.loadConfig()
            .then(() => this.prepareEnv())
            .then(() => this.config.code.generate(this.baseAppSourcesPath, this.generators))
            .then(() => true)
            .catch((e) => {
                throw new Error(e);
            });
    }

    protected load(
        type: LoadableType,
        p0x0Name,
        ID: string = null,
        sources: p0x0source[] | null = null,
    ): Promise<Entity|string> {
        if (type === LoadableType.ENTITY && CARDINALS.includes(p0x0Name)) {
            return Promise.resolve(p0x0Name);
        }
        const _srcStack = (sources || this.sources).slice(0);
        return new Promise((resolve, reject) => {
            const search = () => {
                    if (!_srcStack.length) {
                        return Promise.reject(
                            `${p0x0Name} not found in sources: ${(sources || this.sources).map((s) => s.type).join()}`,
                        );
                    }

                    const srcT = _srcStack.pop();
                    const typeMap: {[key in keyof typeof LoadableType]: () => Promise<Entity|string>} = {} as any;
                    typeMap[LoadableType.ENTITY] = () => this.loadEntity(srcT, p0x0Name);
                    typeMap[LoadableType.IMPLEMENTATION] = () => srcT.loadImplementation(p0x0Name, ID);
                    typeMap[LoadableType.RESOURCE] = () => srcT.loadResource(p0x0Name);
                    return typeMap[type]()
                        .catch((err) => _srcStack.length
                            ? search()
                            : Promise.reject(err),
                        );
            };
            return search()
                .then(resolve)
                .catch((err) => reject(err));
        });
    }

    protected loadEntity(src: p0x0source, entName: string): Promise<Entity> {
        return src.load(entName, false)
            .then((data) => new Entity(data));
    }

    protected async loadObject(obj: any, entity: Entity): Promise<any> {
        for (const prop in obj) {
            if (typeof obj[prop] === "object") {
                if (!entity.fields[prop]) {
                    throw new Error(`Unknown property "${prop}" in ${entity.name}`);
                }
                const [type, isArray, isMap, isFunction] = Entity.getTypeFromString(entity.fields[prop] as string);
                const propEnt: Entity =
                    (await this.load(LoadableType.ENTITY, type)) as Entity;
                const getPropValFnc = async (val: any) => {
                    if (val.RES)  return await this.load(LoadableType.RESOURCE, val.RES);

                    if (val.ID) {
                        val = await this.load(LoadableType.IMPLEMENTATION, propEnt.name, val.ID)
                            .then((imp: any) => ({...imp, ...val}));
                    }
                    return await this.loadObject(val, propEnt);
                };
                if (isMap) {
                    for (const key in obj[prop]) {
                        if (obj[prop].hasOwnProperty(key)) {
                            obj[prop][key] = await getPropValFnc(obj[prop][key]);
                        }
                    }
                } else if (isArray) {
                    obj[prop] = await Promise.all(obj[prop].map((v) => getPropValFnc(v)));
                } else {
                    obj[prop] = obj[prop] && await getPropValFnc(obj[prop]);
                }
            }
        }
        return obj;
    }

    protected async loadInstance(entity: string | Partial<Entity>, data: any): Promise<any> {
        const instName: string = typeof entity === "string" ? entity : entity.name;
        const instanceEntity: Entity = Utils.merge(
            await (this.load(LoadableType.ENTITY, instName) as Promise<Entity>),
            typeof entity === "string" ? {} : entity,
        );
        return (data.ID
            ? this.load(LoadableType.IMPLEMENTATION, instName, data.ID)
            : Promise.resolve(data)
        )
        .then(async (reqImp: any) => ({
            ...(await this.loadObject(reqImp, instanceEntity)),
            ...data,
        }));
    }

    protected async prepareEnv(): Promise<Environment|null> {
        if (!this.config.env) return null;

        const envGen = new EnvGenerator(
            this.config.env,
            `${path.dirname(this.configFile)}/${this.config.output}`,
        );
        return await envGen.run();
    }

    protected loadConfig(): Promise<p0x0genConfig> {
        return new Promise<p0x0genConfig>((resolve, reject) =>
            fs.readFile(this.configFile, (err, data: Buffer) => {
                if (err) return reject(err);

                return resolve(new p0x0genConfig(JSON.parse(data.toString())));
            }),
        )
        .then(async (conf: p0x0genConfig) => {
            this.config = conf;
            if (!this.config.validate()) {
                this.config = null;
                throw new Error("Invalid config.");
            }
            this.baseAppSourcesPath = `${path.dirname(this.configFile)}/${this.config.output}`;
            this.generators = this.config.generators.map((src) =>
                this.addGenerator(src),
            );

            for (const src of this.config.sources) {
                this.sources.push(sourceFactory(src));
            }
            if (this.config.env) {
                this.config.env = await this.loadInstance("Environment", this.config.env);
            }
            if (this.config.code) {
                // Allow have strings instead of object
                this.config.code = await this.preparePackageEntities(this.config.code);
                this.config.code = new Package(
                    await this.loadInstance("Package", this.config.code),
                );
            }
            return this.config;
        });
    }

    private async preparePackageEntities(pkg: Package): Promise<Package> {
        // Allow have strings instead of object
        pkg.entities = await Promise.all(
            (pkg.entities || []).map(async (ent) => {
                let entModel;
                if (typeof ent === "string") {
                    entModel = await this.load(LoadableType.ENTITY, ent);
                } else {
                    entModel = Utils.merge(
                        await this.load(LoadableType.ENTITY, ent.name),
                        ent,
                    );
                }
                if (entModel.platforms) {
                    entModel.platforms = (entModel.platforms || []).map((p: Platform | string) =>
                        typeof p === "string" ? new Platform({name: p}) : p,
                    );
                }
                return entModel;
            }),
        );
        pkg.packages = await  Promise.all(
            (pkg.packages || []).map((subPkg) => {
                return this.preparePackageEntities(subPkg);
            }),
        );
        return pkg;
    }

    private addGenerator(gen: ip0x0genGeneratorConfig | string): p0x0generator {
        let cnf: ip0x0genGeneratorConfig = null,
            lang: string;
        if (typeof gen === "string") {
            lang = gen;
        } else {
            lang = gen.platform;
            cnf = gen;
        }
        if (!generators[lang]) throw new Error(`Invalid config: unknown generator ${lang}.`);
        return (new generators[lang](
            this.baseAppSourcesPath
            + (this.config.code &&  this.config.code.name ? `/${this.config.code.name}` : ""),
            cnf || {lang},
        )) as p0x0generator;
    }
}
