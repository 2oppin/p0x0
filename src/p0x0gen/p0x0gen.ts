import * as fs from 'fs';
import {ip0x0, p0x0} from "../p0x0/p0x0";
import {p0x0helper as hlp} from "../p0x0helper/p0x0helper";
import {p0x0genConfig} from "./config/config";
import * as generators from "./generator"
import {p0x0generator} from "./generator";
import {sourceTypes as allAvailableSources} from "../p0x0res/source/";
import {ip0x0genSourceConfig, p0x0source} from "../p0x0res/source/source";

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
    };
    get config(): p0x0genConfig {
        return this._config;
    };

    constructor(fileName: string = "p0x0.json") {
        super();
        this._configFile = fileName;
    }

    public run(): Promise<boolean> {
        return this._loadConfig()
            .then((conf:p0x0genConfig) =>
                Promise.all(
                    this._config.prototypes.map(
                    (p0x0Name: string) =>
                        this.load(p0x0Name)
                            .then(obj => [obj, p0x0Name])
                ))
            )
            .then((objs: any[][]) => Promise.all(objs.map(arr => this.generate(arr[0], arr[1]))))
            .then(results => !results.find(res => !res));
    }

    public generate(obj: p0x0, name:string = null): Promise<boolean>
    {
        return Promise.all(this._generators.map(g => g.generate(obj, name)))
            .then((res: boolean[]) => !res.find(res => res !== true));
    }

    protected load(p0x0Name): Promise<p0x0>
    {
        let _srcStack = this._sources.slice(0),
            processedSrcNames: string[] = [];
        return new Promise((resolve) => {
            let search = () => {
                    if (!_srcStack.length)
                        return Promise.reject(p0x0Name + " not found in sources: " + processedSrcNames.join());

                    let srcT = _srcStack.pop();
                    return srcT
                        .load(p0x0Name)
                        .catch(err => {
                            processedSrcNames.push(srcT.name);
                            return _srcStack.length
                                ? search()
                                : Promise.reject(err);
                        });
                };
            return search()
                .then(resolve)
                .catch(err => {
                    throw err;
                });
        });
    }

    protected _loadConfig(): Promise<p0x0genConfig> {
        return new Promise<p0x0genConfig>((resolve, reject) =>
            fs.readFile(this._configFile, (err, data: Buffer) => {
                if (err) return reject(err);

                return resolve(<p0x0genConfig>hlp.fill(new p0x0genConfig(), JSON.parse(data.toString())))
            })
        )
        .then((conf:p0x0genConfig) => {
            this._config = conf;
            if (!this._config.validate()) {
                this._config = null;
                throw new Error("Invalid config.");
            }
            let cnfDir = this.configFile.slice(0, this.configFile.lastIndexOf("/") + 1);
            this._generators = this._config.generators.map(lang => {
                if (!generators[lang]) throw new Error(`Invalid config: unknown generator ${lang}.`);
                return <p0x0generator>(new generators[lang](cnfDir + this._config.output));
            });
            for(let src of this._config.sources) {
                let cnf: ip0x0genSourceConfig = null,
                    nm: string;
                if (typeof src === "string")
                    nm = src;
                else {
                    nm = src.name;
                    cnf = src;
                }
                if (allAvailableSources[nm])
                    this._sources.push(new allAvailableSources[nm](cnf));
            }

            return this._config;
        });
    }
}