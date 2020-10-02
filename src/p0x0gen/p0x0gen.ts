import * as fs from "fs";
import * as path from "path";

import {Entity} from "p0x0/entity";
import {Environment} from "p0x0/environment";
import {dockerCompose} from "p0x0gen/generator/env/dockerCompose";
import {sourceFactory} from "p0x0res";
import {p0x0source} from "p0x0res/source";
import {p0x0genConfig} from "./config/config";
import * as generators from "./generator";
import {p0x0generator} from "./generator";
import {ip0x0genGeneratorConfig} from "./generator/generator";

const CARDINALS = ["String", "Int", "Float", "Boolean"];
enum LoadableType {ENTITY = "entity", IMPLEMENTATION = "ID", RESOURCE = "RES"}

export class p0x0gen {
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
            .then(() => this.loadAll())
            .then((objs: Entity[]) => Promise.all(objs.map((obj) => this.generate(obj))))
            .then((results) => !results.find((res) => !res))
            .catch((e) => {
                throw new Error(e);
            });
    }

    public generate(obj: Entity): Promise<boolean> {
        return Promise.all(this.generators.map((g) => g.generate(obj)))
            .then((res: boolean[]) => !res.find((r) => r !== true));
    }

    protected loadAll(): Promise<Entity[]> {
        const loadedEnts: {[name: string]: Entity} = {};
        return Promise.all(
            this.config.prototypes.map(
                (p0x0Name: string) =>
                    this.load(LoadableType.ENTITY, p0x0Name)
                        .then((ent: Entity) => loadedEnts[p0x0Name] = ent)
                        .catch((err) => {
                            throw new Error(err);
                        }),
            )).then((ents: Entity[]) => {
                ents = ents.map((ent) => {
                    const baseName: string = typeof (ent.base as any) === "string" ? (ent.base as any) : "";
                    if (baseName) (ent.base as any) = loadedEnts[baseName] || baseName;
                    return ent;
                });
                return ents;
            });
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

    protected async loadInstance(instName: string, data: any): Promise<any> {
        const instanceEntity: Entity = await (this.load(LoadableType.ENTITY, instName) as Promise<Entity>);
        return (data.ID
            ? this.load(LoadableType.IMPLEMENTATION, instName, data.ID)
            : Promise.resolve(data)
        )
        .then(async (reqImp: any) => {
            const scanProps = async (obj: any, entity: Entity): Promise<any> => {
                for (const prop in obj) {
                    if (typeof obj[prop] === "object") {
                        if (!entity.fields[prop]) {
                            throw new Error(`Unknown property "${prop}" in ${entity.name}`);
                        }
                        const [type, isArray, isMap] = this.getTypeFromString(entity.fields[prop] as string);
                        const propEnt: Entity =
                            (await this.load(LoadableType.ENTITY, type)) as Entity;
                        const getPropValFnc = async (val: any) => {
                            if (val.RES)  return await this.load(LoadableType.RESOURCE, val.RES);

                            if (val.ID) {
                                val = await this.load(LoadableType.IMPLEMENTATION, propEnt.name, val.ID)
                                    .then((imp: any) => ({...imp, ...val}));
                            }
                            return await scanProps(val, propEnt);
                        };
                        if (isArray) {
                            obj[prop] = await Promise.all(obj[prop].map((v) => getPropValFnc(v)));
                        } else {
                            obj[prop] = await getPropValFnc(obj[prop]);
                        }
                    }
                }
                return obj;
            };
            return {...(await scanProps(reqImp, instanceEntity)), ...data};
        });
    }

    protected getTypeFromString(propValue: string): [string, boolean, boolean] {
        const [isMap, , type, isArray] =
            propValue.match(/(Map<[A-Za-z][A-Za-z\d]*,\s*)*([A-Za-z][A-Za-z\d]*)>?(\[\])*/);
        return [type, !!isArray, !!isMap];
    }

    protected prepareEnv(): Promise<Environment|null> {
        if (!this.config.env) return null;
        const envBuilder = new dockerCompose();
        const envPromise: Promise<Environment> = this.loadInstance("Environment", this.config.env);
        const fileName = `${path.dirname(this.configFile)}/${this.config.output}/${this.config.env.name}`;
        return fs.promises.mkdir(path.dirname(fileName), {recursive: true})
            .then(() => envPromise)
            .then((env: Environment) =>
                fs.promises.writeFile(fileName, envBuilder.prepare(env))
                    .then(() => env),
            );
    }

    protected loadConfig(): Promise<p0x0genConfig> {
        return new Promise<p0x0genConfig>((resolve, reject) =>
            fs.readFile(this.configFile, (err, data: Buffer) => {
                if (err) return reject(err);

                return resolve(new p0x0genConfig(JSON.parse(data.toString())));
            }),
        )
        .then((conf: p0x0genConfig) => {
            this.config = conf;
            if (!this.config.validate()) {
                this.config = null;
                throw new Error("Invalid config.");
            }
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
                    `${path.dirname(this.configFile)}/${this.config.output}`,
                    cnf || {lang},
                )) as p0x0generator;
            });

            for (const src of this.config.sources) {
                this.sources.push(sourceFactory(src));
            }

            return this.config;
        });
    }
}
