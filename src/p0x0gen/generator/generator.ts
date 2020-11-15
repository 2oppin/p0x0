import * as fs from "fs";
import {Platform} from "p0x0/platform";
import {SourcePool} from "p0x0res/sourcePool";
import * as path from "path";

import {Entity} from "p0x0/entity";

export interface ip0x0genGeneratorConfig {
    platform: string;
}

export interface ip0x0generator {
    platform: Platform;
    ext: string;
    output: string;
}

export abstract class p0x0generator implements ip0x0generator {
    public static generateRaw(fullName: string, body: Buffer): Promise<boolean> {
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
    get platform(): Platform {
        return new Platform({
            name: this.constructor.name,
        });
    }

    get ext(): string {
        return this.platform.name.toLowerCase();
    }

    constructor(
        protected _output: string = "./",
        protected _config: ip0x0genGeneratorConfig = null,
        protected sources: SourcePool,
    ) {}

    public async generate(prototype: Entity, output?: string): Promise<boolean> {
        return p0x0generator.generateRaw(
            (output || this.output) + "/" + prototype.name + "." + this.ext,
            Buffer.from(await this.prepare(prototype)),
        );
    }

    public abstract async prepare(prototype: Entity): Promise<string>;
}
