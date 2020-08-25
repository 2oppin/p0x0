import {Entity} from "p0x0/entity";
import {p0x0} from "p0x0/p0x0";

export abstract class p0x0convertor extends p0x0 {
    get type(): string {
        return this.constructor.name.toLowerCase();
    }
    constructor() {
        super();
    }
    public abstract convert(buff: Buffer | string): Promise<Entity>;
}
