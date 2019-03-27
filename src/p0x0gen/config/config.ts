import {ip0x0, p0x0} from "../../p0x0/p0x0";
import {ip0x0genSourceConfig} from "../../p0x0res/source/source";

export interface ip0x0genConfig extends ip0x0 {
    generators: string[];
    output: string;
    prototypes: string[];
    sources: Array<ip0x0genSourceConfig|string>;
    validate: () => boolean;
}

export class p0x0genConfig extends p0x0 implements ip0x0genConfig {
    generators: string[] = ['ts'];
    output: string = 'generator/';
    prototypes: string[] = [];
    sources: Array<string|ip0x0genSourceConfig> = [{
        name: "schema.org"
    }];

    validate() {
        let rules = [
            () => this.output.search(/\.\.\//) == -1
        ];
        for(let r of rules)
            if (!r())
                return false;
        return true;
    }
}