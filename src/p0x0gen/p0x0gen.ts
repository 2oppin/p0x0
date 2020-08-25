import * as fs from "fs";
import {Entity} from "p0x0/entity";
import {ip0x0, p0x0} from "p0x0/p0x0";
import {sourceTypes as allAvailableSources} from "p0x0res/source";
import {p0x0helper as hlp} from "../p0x0helper/p0x0helper";
import {ip0x0genSourceConfig, p0x0source} from "../p0x0res/source/source";
import {p0x0genConfig} from "./config/config";
import * as generators from "./generator";
import {p0x0generator} from "./generator";
import {ip0x0genGeneratorConfig} from "./generator/generator";

export interface ip0x0gen extends ip0x0 {
    configFile: string;
}
export class p0x0gen extends p0x0 {
    protected _configFile: string;
    protected _config: p0x0genConfig;
    protected _generators: p0x0generator[] = [];
    protected _sources: p0x0source[] = [];
    get configFile(): string {
        return this._configFile;
    }
    get config(): p0x0genConfig {
        return this._config;
    }

    constructor(fileName: string = "p0x0.json") {
        super();
        this._configFile = fileName;
    }

    public run(): Promise<boolean> {
        return this._loadConfig()
            .then((conf: p0x0genConfig) => this.loadAll())
            .then((objs: Entity[]) => Promise.all(objs.map((obj) => this.generate(obj))))
            .then((results) => !results.find((res) => !res))
            .catch((e) => {
                throw new Error(e);
            });
    }

    public generate(obj: Entity): Promise<boolean> {
        return Promise.all(this._generators.map((g) => g.generate(obj)))
            .then((res: boolean[]) => !res.find((r) => r !== true));
    }

    protected loadAll(): Promise<Entity[]> {
        const loadedEnts: {[name: string]: Entity} = {};
        return Promise.all(
            this._config.prototypes.map(
                (p0x0Name: string) =>
                    this.load(p0x0Name)
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

    protected load(p0x0Name): Promise<Entity> {
        const _srcStack = this._sources.slice(0),
            processedSrcNames: string[] = [];
        return new Promise((resolve, reject) => {
            const search = () => {
                    if (!_srcStack.length) {
                        return Promise.reject(p0x0Name + " not found in sources: " + processedSrcNames.join());
                    }

                    const srcT = _srcStack.pop();
                    return srcT
                        .load(p0x0Name)
                        .then((ent) => processedSrcNames[srcT.name] = ent)
                        .catch((err) => {
                            processedSrcNames.push(srcT.name);
                            return _srcStack.length
                                ? search()
                                : Promise.reject(err);
                        });
                };
            return search()
                .then(resolve)
                .catch((err) => reject(err));
        });
    }

    protected _loadConfig(): Promise<p0x0genConfig> {
        return new Promise<p0x0genConfig>((resolve, reject) =>
            fs.readFile(this._configFile, (err, data: Buffer) => {
                if (err) return reject(err);

                return resolve(hlp.fill(new p0x0genConfig(), JSON.parse(data.toString())) as p0x0genConfig);
            }),
        )
        .then((conf: p0x0genConfig) => {
            this._config = conf;
            if (!this._config.validate()) {
                this._config = null;
                throw new Error("Invalid config.");
            }
            const cnfDir = this.configFile.slice(0, this.configFile.lastIndexOf("/") + 1);
            this._generators = this._config.generators.map((src) => {
                let cnf: ip0x0genGeneratorConfig = null,
                    lang: string;
                if (typeof src === "string") {
                    lang = src;
                } else {
                    lang = src.lang;
                    cnf = src;
                }
                if (!generators[lang]) throw new Error(`Invalid config: unknown generator ${lang}.`);
                return (new generators[lang](cnfDir + this._config.output, cnf || {lang})) as p0x0generator;
            });
            for (const src of this._config.sources) {
                let cnf: ip0x0genSourceConfig = null,
                    nm: string;
                if (typeof src === "string") {
                    nm = src;
                } else {
                    nm = src.name;
                    cnf = src;
                }
                if (allAvailableSources[nm]) {
                    this._sources.push(new allAvailableSources[nm](cnf));
                }
            }

            return this._config;
        });
    }
}
