import {Entity} from "p0x0/entity";
import {p0x0fileSource} from "./files/file.source";

export class json extends p0x0fileSource {
    public convert(buff: Buffer | string): Promise<Entity> {
        return Promise.resolve(
            JSON.parse(buff.toString()) as Entity,
        );
    }
}
