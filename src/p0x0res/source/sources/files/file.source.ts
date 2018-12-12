import * as fs from 'fs';
import {ip0x0source, p0x0source} from "../../source";
import {ip0x0, p0x0} from "../../../../p0x0/p0x0";

export interface ip0x0fileSource extends ip0x0source {
    dir: string;
    ext: string;
    convert(buff: Buffer| string): Promise<p0x0>;
}

export abstract class p0x0fileSource extends p0x0source implements ip0x0fileSource {
    protected _dir;
    get dir() { return this._dir; }
    get ext() {
        return this.name;
    }

    constructor(dir?: string) {
        super();
        if (dir) this._dir = dir;
    }

    load(name: string): Promise<p0x0> {
        return new Promise((resolve, reject) =>
            fs.readdir(this._dir, null,(err, files) => {
                if (err) return reject(err);
                let p0x0FileName = name + "." + this.ext,
                    p0x0File = files
                        .find(n => n == p0x0FileName);
                if (!p0x0File)
                    return reject(this._dir + "/" + p0x0FileName + " not found.");
                let buff;
                try {
                    buff = fs.readFileSync(this._dir + "/" + p0x0File);
                } catch (e) {
                    return reject(e);
                }
                return resolve(this.convert(buff));
            })
        );
    }

    abstract convert(buff: Buffer | string): Promise<p0x0>;
}