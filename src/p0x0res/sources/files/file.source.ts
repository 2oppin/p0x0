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

    public load(name: string, raw: boolean = false): Promise<Entity|string> {
        return new Promise((resolve, reject) =>
            fs.readdir(this._dir, null, (err, files) => {
                if (err) return reject(err);
                const p0x0FileName = `${name}.${this.ext}`,
                    p0x0File = files
                        .find((n) => n === p0x0FileName);
                if (!p0x0File) {
                    return reject(this._dir + "/" + p0x0FileName + " not found.");
                }
                let buff;
                try {
                    buff = fs.readFileSync(this._dir + "/" + p0x0File);
                } catch (e) {
                    return reject(e);
                }
                return resolve(raw ? buff : this.convertor.convert(buff));
            }),
        );
    }
}
