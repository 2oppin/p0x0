import * as fs from 'fs';
import {ip0x0, p0x0} from "../p0x0/p0x0";
import {p0x0helper as hlp} from "../p0x0helper/p0x0helper";
import {p0x0genConfig} from "./config/config";
import * as generators from "./generator"
import {p0x0generator} from "./generator";
import * as sources from "../p0x0res/source/source";
import {p0x0source} from "../p0x0res/source/source";

// Fill cache with proper names (leave both cebab & dotted)
for (let s of Object.getOwnPropertyNames(sources)) {
    let t = new sources[s];
    if (!sources[t.name])
        sources[t.name] = sources[s];
}

export interface ip0x0gen extends ip0x0 {
    configFile: string;
}
export class p0x0gen extends p0x0 {
    protected _configFile: string;
    protected _config: p0x0genConfig;
    protected _generator: p0x0generator;
    protected _sources: p0x0source;
    get configFile(): string {
        return this._configFile;
    };

    constructor(fileName: string = "p0x0.json") {
        super();
        this._configFile = fileName;
    }

    public run(): Promise<any> {
        return this._loadConfig()
            .then((conf:p0x0genConfig) =>
                Promise.all(this._config.prototypes.map(this.generate))
            );
    }

    public generate(obj: p0x0)
    {
        return this._generator.generate(obj)
    }

    protected _loadConfig(): Promise<p0x0genConfig> {
        return new Promise<p0x0genConfig>((resolve) =>
            fs.readFile(this._configFile, (data) =>
                resolve(<p0x0genConfig>hlp.fill(new p0x0genConfig(), data))
            )
        )
        .then((conf:p0x0genConfig) => {
            this._config = conf;
            this._generator = <p0x0generator>(new generators[this._config.lang](this._config.output));

            return this._config;
        });
    }
}