import * as fs from 'fs';
import {ip0x0, p0x0} from "../../p0x0/p0x0";

export interface ip0x0generator extends ip0x0 {
    lang: string;
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

    constructor(output:string = "./") {
        super();
        this._output = output;
        return this;
    }

    generate(prototype:p0x0): Promise<any> {
        return new Promise<any>((resolve) =>
            fs.writeFile(this.output, this.prepare(prototype), null, resolve)
        );
    }

    abstract prepare(prototype:p0x0): string;
}