import * as fs from "fs";
import {Entity} from "p0x0/entity";
import {p0x0convertor} from "../../convertor";
import {ip0x0genResourceConfig, p0x0source} from "../../source";

export interface ip0x0fileSourceConfig extends ip0x0genResourceConfig {
    dir?: string;
}

export class p0x0fileSource extends p0x0source {
    protected _dir = `${process.cwd()}/entities`;
    get type() { return this.convertor.type; }

    get dir() { return this._dir; }
    get ext() {
        return this.convertor.type;
    }
    constructor(protected config: ip0x0fileSourceConfig = null, protected convertor: p0x0convertor = null) {
        super(config, convertor);
        if (this.config && this.config.dir) {
            if (!this._dir.match(/^\//)) {
                const relPath = this._dir.match(/^\.\//)
                    ? this.config.dir.slice(2)
                    : this.config.dir;
                this._dir = `${process.cwd()}/${relPath}`;
            } else {
                this._dir = this.config.dir;
            }
        }
    }

    public loadImplementation(name: string, ID: string): Promise<any> {
        const p0x0FileName = `${ID}.${this.ext}`;
        return this.readFile(p0x0FileName)
            .then((buff) => this.convertor.convert(buff));
    }
    public loadResource(RESID: string): Promise<Buffer> {
        return this.readFile(RESID);
    }

    public load(name: string, raw: boolean = false): Promise<Entity|string> {
        const p0x0FileName = `${name}.${this.ext}`;
        return this.readFile(p0x0FileName)
            .then(async (buff: Buffer) => raw
                    ? buff.toString()
                    : await this.convertor.convert(buff),
            );
    }

    protected readFile(p0x0FileName: string): Promise<Buffer> {
        return new Promise((resolve, reject) =>
            fs.readFile(this._dir + "/" + p0x0FileName, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }),
        );
    }
}
