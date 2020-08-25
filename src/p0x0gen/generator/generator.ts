import * as fs from "fs";
import {Entity} from "../../p0x0/entity";
import {ip0x0, p0x0} from "../../p0x0/p0x0";

export interface ip0x0genGeneratorConfig extends ip0x0 {
    lang: string;
}

export interface ip0x0generator extends ip0x0 {
    lang: string;
    ext: string;
    output: string;
}

export abstract class p0x0generator extends p0x0 implements ip0x0generator {
    public get output(): string {
        return this._output;
    }
    get lang(): string {
        return this.constructor.name;
    }

    get ext(): string {
        return this.lang.toLowerCase();
    }

    constructor(protected _output: string = "./", protected _config: ip0x0genGeneratorConfig = null) {
        super();
    }

    public generate(prototype: Entity): Promise<boolean> {
        return new Promise<any>((resolve, reject) => {
            if (!fs.existsSync(this.output)) {
                fs.mkdirSync(this.output);
            }

            fs.writeFile(
                this.output + "/" + prototype.name + "." + this.ext,
                this.prepare(prototype),
                null,
                (err) =>  err ? reject(err) : resolve(true),
            );
        });
    }

    public abstract prepare(prototype: Entity): string;
}
