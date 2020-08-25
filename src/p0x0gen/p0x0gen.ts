import * as fs from "fs";
import {Entity} from "p0x0/entity";
import {ip0x0, p0x0} from "p0x0/p0x0";
import {sourceFactory} from "p0x0res";
import {p0x0source} from "p0x0res/source";
import {p0x0helper as hlp} from "../p0x0helper/p0x0helper";
import {p0x0genConfig} from "./config/config";
import * as generators from "./generator";
import {p0x0generator} from "./generator";
import {ip0x0genGeneratorConfig} from "./generator/generator";

export interface ip0x0gen extends ip0x0 {
    configFile: string;
}
export class p0x0gen extends p0x0 {
    protected configFile: string;
    protected config: p0x0genConfig;
    protected generators: p0x0generator[] = [];
    protected sources: p0x0source[] = [];

    constructor(fileName: string) {
        super();
        this.configFile = fileName;
    }

    get output() {
        return this.config.output;
    }

    public run(): Promise<boolean> {
        return this._loadConfig()
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
        const _srcStack = this.sources.slice(0);
        const processedSrcNames: string[] = [];
        return new Promise((resolve, reject) => {
            const search = () => {
                    if (!_srcStack.length) {
                        return Promise.reject(`${p0x0Name} not found in sources: ${Object.keys(processedSrcNames).join()}`);
                    }

                    const srcT = _srcStack.pop();
                    return srcT
                        .load(p0x0Name, false)
                        .catch((err) => {
                            processedSrcNames.push(srcT.type);
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
            fs.readFile(this.configFile, (err, data: Buffer) => {
                if (err) return reject(err);

                return resolve(hlp.fill(new p0x0genConfig(), JSON.parse(data.toString())) as p0x0genConfig);
            }),
        )
        .then((conf: p0x0genConfig) => {
            this.config = conf;
            if (!this.config.validate()) {
                this.config = null;
                throw new Error("Invalid config.");
            }
            const cnfDir = this.configFile.slice(0, this.configFile.lastIndexOf("/") + 1);
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
                return (new generators[lang](cnfDir + this.config.output, cnf || {lang})) as p0x0generator;
            });

            for (const src of this.config.sources) {
                this.sources.push(sourceFactory(src));
            }

            return this.config;
        });
    }
}
