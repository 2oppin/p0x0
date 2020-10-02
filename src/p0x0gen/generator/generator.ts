import * as fs from "fs";
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

    public generate(prototype: Entity): Promise<boolean> {
        return new Promise<any>((resolve, reject) => {
            if (!fs.existsSync(this.output)) {
                fs.mkdirSync(this.output);
            }
            fs.writeFile(
                this.output + "/" + prototype.name + "." + this.ext,
                this.prepare(prototype),
                null,
                (err) =>  {
                    return err ? reject(err) : resolve(true);
                },
            );
        });
    }

    public abstract prepare(prototype: Entity): string;
}
