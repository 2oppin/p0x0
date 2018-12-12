import * as fs from 'fs';
import {ip0x0, p0x0} from "../../p0x0/p0x0";

export interface ip0x0generator extends ip0x0 {
    lang: string;
    ext: string;
    output: string;
}

export abstract class p0x0generator extends p0x0 implements ip0x0generator {
    protected _output:string = "./";
    public get output(): string
    {
        return this._output;
    }
    get lang(): string {
        return this.constructor.name;
    }

    get ext(): string {
        return this.lang.toLowerCase();
    }

    constructor(output:string = "./") {
        super();
        this._output = output;
        return this;
    }

    generate(prototype:p0x0, name: string = null): Promise<boolean> {
        return new Promise<any>((resolve, reject) => {
            if (!fs.existsSync(this.output))
                fs.mkdirSync(this.output);
            name = name || prototype.constructor.name;
            fs.writeFile(
                this.output + "/" + name + "." + this.ext,
                this.prepare(prototype, name),
                null,
                (err) =>  err ? reject(err) : resolve(true)
            )
        });
    }

    abstract prepare(prototype:p0x0, name?:string): string;
}