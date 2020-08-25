import * as fs from "fs";
import {Entity} from "p0x0/entity";
import {ip0x0genSourceConfig, ip0x0source, p0x0source} from "../../source";

export interface ip0x0fileSourceConfig extends ip0x0genSourceConfig {
    dir?: string;
}

export interface ip0x0fileSource extends ip0x0source {
    dir: string;
    ext: string;
    convert(buff: Buffer| string): Promise<Entity>;
}

export abstract class p0x0fileSource extends p0x0source implements ip0x0fileSource {
    protected _dir;
    get dir() { return this._dir; }
    get ext() {
        return this.name;
    }

    constructor(protected _config: ip0x0fileSourceConfig = null) {
        super();
        if (this._config && this._config.dir) {
            this._dir = this._config.dir;
            if (this._dir.match(/^\.\//)) {
                this._dir = process.cwd() + "/" + this._dir.slice(2);
            }
        }
    }

    public load(name: string): Promise<Entity> {
        return new Promise((resolve, reject) =>
            fs.readdir(this._dir, null, (err, files) => {
                if (err) return reject(err);
                const p0x0FileName = name + "." + this.ext,
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
                return resolve(this.convert(buff));
            }),
        );
    }

    public abstract convert(buff: Buffer | string): Promise<Entity>;
}
