import {ip0x0, p0x0} from "../../p0x0/p0x0";

export interface ip0x0genConfig extends ip0x0 {
    lang: string;
    output: string;
    prototypes: string[];
    sources: string[];
    validate: () => boolean;
}

export class p0x0genConfig extends p0x0 implements ip0x0genConfig {
    lang: string = 'ts';
    output: string = 'generator/';
    prototypes: string[] = [];
    sources: string[] = ['schema.org'];

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