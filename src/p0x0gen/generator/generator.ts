import * as fs from "fs";
import * as path from "path";

import {Entity} from "p0x0/entity";

export interface ip0x0genGeneratorConfig {
    lang: string;
}

export interface ip0x0generator {
    lang: string;
    ext: string;
    output: string;
}

export abstract class p0x0generator implements ip0x0generator {
    public static generateRaw(fullName: string, body: string): Promise<boolean> {
        const dir = path.dirname(fullName);
        return new Promise<any>((resolve, reject) => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            fs.writeFile(fullName, body, null, (err) =>  {
                return err ? reject(err) : resolve(true);
            });
        });
    }

    public get output(): string {
        return this._output;
    }
    get lang(): string {
        return this.constructor.name;
    }

    get ext(): string {
        return this.lang.toLowerCase();
    }

    constructor(protected _output: string = "./", protected _config: ip0x0genGeneratorConfig = null) {}

    public generate(prototype: Entity, output?: string): Promise<boolean> {
        return p0x0generator.generateRaw(
            (output || this.output) + "/" + prototype.name + "." + this.ext,
            this.prepare(prototype),
        );
    }

    public abstract prepare(prototype: Entity): string;
}
