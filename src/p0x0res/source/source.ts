import {ip0x0, p0x0} from "../../p0x0/p0x0";

export interface ip0x0source extends ip0x0 {
    name: string;
    load(name:string): Promise<p0x0>;
}

export abstract class p0x0source extends p0x0 implements ip0x0source {
    get name(): string {
        return this.constructor.name.replace(/[A-Z]/, (s) => '.' + s.toLowerCase());
    }

    abstract load(name:string): Promise<p0x0>;
}