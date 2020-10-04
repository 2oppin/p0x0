import {Environment} from "p0x0/environment";
import {Model} from "p0x0/model";
import {Package} from "p0x0/package";
import {ip0x0genResourceConfig} from "p0x0res/source";
import {ip0x0genGeneratorConfig} from "../generator/generator";

export interface ip0x0genConfig {
    output: string;
    env: Environment;
    code: Package;
    sources: Array<ip0x0genResourceConfig|string>;
    generators: Array<ip0x0genGeneratorConfig|string>;
    validate: () => boolean;
}

export class p0x0genConfig extends Model implements ip0x0genConfig {
    public env: Environment;
    public code: Package;
    public generators: Array<ip0x0genGeneratorConfig|string>;
    public output: string;
    public sources: Array<string|ip0x0genResourceConfig>;
    constructor(config: ip0x0genConfig) {
        super({
            generators: ["ts"],
            output: "generator/",
            sources: [{type: "json"}],
            ...config,
        });
    }

    public validate() {
        const rules = [
            () => this.output.search(/\.\.\//) === -1,
        ];
        for (const r of rules) {
            if (!r()) {
                return false;
            }
        }
        return true;
    }
}
