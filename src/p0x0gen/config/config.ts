import {ip0x0, p0x0} from "p0x0/p0x0";
import {ip0x0genSourceConfig} from "p0x0res/source";
import {ip0x0genGeneratorConfig} from "../generator/generator";

export interface ip0x0genConfig extends ip0x0 {
    generators: Array<ip0x0genGeneratorConfig|string>;
    output: string;
    prototypes: string[];
    sources: Array<ip0x0genSourceConfig|string>;
    validate: () => boolean;
}

export class p0x0genConfig extends p0x0 implements ip0x0genConfig {
    public generators: Array<ip0x0genGeneratorConfig|string> = ["ts"];
    public output: string = "generator/";
    public prototypes: string[] = [];
    public sources: Array<string|ip0x0genSourceConfig> = [{
        name: "json",
    }];

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
