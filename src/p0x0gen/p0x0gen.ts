import * as fs from "fs";
import {Package} from "p0x0/package";
import {EnvGenerator} from "p0x0gen/generator/env/env.generator";
import * as path from "path";

import {Entity} from "p0x0/entity";
import {Environment} from "p0x0/environment";
import {sourceFactory} from "p0x0res";
import {p0x0source} from "p0x0res/source";
import {p0x0genConfig} from "./config/config";
import * as generators from "./generator";
import {p0x0generator} from "./generator";
import {ip0x0genGeneratorConfig} from "./generator/generator";

const CARDINALS = ["String", "Int", "Float", "Boolean"];
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
            .then(() => this.generatePackage(this.config.code, this.baseAppSourcesPath))
            .then(() => true)
            .catch((e) => {
                throw new Error(e);
            });
    }

    protected generatePackage(pkg: Package, baseDir: string): Promise<any> {
        const pkgPath = pkg.name ? `${baseDir}/${pkg.name}` : baseDir;
        if (!fs.existsSync(pkgPath)) {
            fs.mkdirSync(pkgPath, {recursive: true});
        }

        return Promise.all([
            ...(pkg.packages || []).map((p) => this.generatePackage(p, pkgPath)),
            ...(pkg.entities || []).map(
                (entityName) =>
                    this.load(LoadableType.ENTITY, entityName)
                        .then((entity: Entity) => this.generateEntityCode(entity, pkgPath)),
            ),
        ])
        .then(() => Promise.all([
            ...(pkg.scripts || []).map(
                (script) => p0x0generator
                    .generateRaw(`${pkgPath}/${script.name}`, script.body),
            ),
        ]));
    }

    protected generateEntityCode(obj: Entity, baseDir: string): Promise<any> {
        return Promise.all(this.generators.map((g) => g.generate(obj, baseDir)))
            .then((res: boolean[]) => !res.find((r) => r !== true));
    }

    protected mapCardinals(cardinal: string): any {
        switch (cardinal) {
            case "Int": return Number;
            case "Float": return Number;
            case "Boolean": return Boolean;
            case "String":
            default:
                return String;
        }
    }

    protected load(
        type: LoadableType,
        p0x0Name,
        ID: string = null,
        sources: p0x0source[] | null = null,
    ): Promise<Entity|string> {
        if (type === LoadableType.ENTITY && CARDINALS.includes(p0x0Name)) {
            return Promise.resolve(this.mapCardinals(p0x0Name));
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
                    typeMap[LoadableType.ENTITY] = () => srcT.load(p0x0Name, false);
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

    protected async loadObject(obj: any, entity: Entity): Promise<any> {
        for (const prop in obj) {
            if (typeof obj[prop] === "object") {
                if (!entity.fields[prop]) {
                    throw new Error(`Unknown property "${prop}" in ${entity.name}`);
                }
                const [type, isArray, isMap, isFunction] = this.getTypeFromString(entity.fields[prop] as string);
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
                if (isArray) {
                    obj[prop] = await Promise.all(obj[prop].map((v) => getPropValFnc(v)));
                } else {
                    obj[prop] = await getPropValFnc(obj[prop]);
                }
            }
        }
        return obj;
    }

    protected async loadInstance(instName: string, data: any): Promise<any> {
        const instanceEntity: Entity = await (this.load(LoadableType.ENTITY, instName) as Promise<Entity>);
        return (data.ID
            ? this.load(LoadableType.IMPLEMENTATION, instName, data.ID)
            : Promise.resolve(data)
        )
        .then(async (reqImp: any) => ({
            ...(await this.loadObject(reqImp, instanceEntity)),
            ...data,
        }));
    }

    protected getTypeFromString(propValue: string): [string, boolean, boolean, boolean] {
        const [isMap, , type, isArray, isFunction] =
            propValue.match(/(Map<[A-Za-z][A-Za-z\d]*,\s*)*([A-Za-z][A-Za-z\d]*)>?(\[\])*(\([^)]*\))*/);
        return [type, !!isArray, !!isMap, !!isFunction];
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
            this.generators = this.config.generators.map((src) => {
                let cnf: ip0x0genGeneratorConfig = null,
                    lang: string;
                if (typeof src === "string") {
                    lang = src;
                } else {
                    lang = src.lang;
                    cnf = src;
                }
                if (!generators[lang]) throw new Error(`Invalid config: unknown generator ${lang}.`);
                return (new generators[lang](
                    this.baseAppSourcesPath
                        + (this.config.code &&  this.config.code.name ? `/${this.config.code.name}` : ""),
                    cnf || {lang},
                )) as p0x0generator;
            });

            for (const src of this.config.sources) {
                this.sources.push(sourceFactory(src));
            }
            if (this.config.env) {
                this.config.env = await this.loadInstance("Environment", this.config.env);
            }
            if (this.config.code) {
                this.config.code = await this.loadInstance("Package", this.config.code);
            }
            return this.config;
        });
    }
}
