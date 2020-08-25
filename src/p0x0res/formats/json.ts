import {Entity} from "p0x0/entity";
import {p0x0convertor} from "../convertor";

export class json extends p0x0convertor {
    public convert(buff: Buffer | string): Promise<Entity> {
        return Promise.resolve(
            JSON.parse(buff.toString()) as Entity,
        );
    }
}
