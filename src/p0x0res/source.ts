import {Entity} from "p0x0/entity";
import {ip0x0, p0x0} from "p0x0/p0x0";
import {p0x0convertor} from "./convertor";

export interface ip0x0genResourceConfig extends ip0x0 {
    type: string;
    url?: string;
    dir?: string;
}

export abstract class p0x0source {
    protected constructor(
        protected config: ip0x0genResourceConfig = null,
        protected convertor: p0x0convertor = null,
    ) {}

    public abstract load(name: string, raw: boolean): Promise<Entity|string>;
    public abstract get type();
}
