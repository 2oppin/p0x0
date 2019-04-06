import {p0x0fileSource} from "./files/file.source";
import {Entity} from "../../../p0x0/entity";

export class json extends p0x0fileSource {
    convert(buff: Buffer | string): Promise<Entity> {
        let ent: Entity = JSON.parse(buff.toString());
        return Promise.resolve(ent);
    }
}
