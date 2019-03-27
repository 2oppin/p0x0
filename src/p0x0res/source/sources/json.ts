import {p0x0} from "../../../p0x0/p0x0";
import {ip0x0fileSourceConfig, p0x0fileSource} from "./files/file.source";

export interface IEntity {
    name: string;
    fields: {[name: string]: string};
}
export class json extends p0x0fileSource {
    convert(buff: Buffer | string): Promise<p0x0> {
        let ent: IEntity = JSON.parse(buff.toString());

        let props: any = ent.fields,
            obj = {};
        for (const p of Object.getOwnPropertyNames(props)) {
            obj[p] = null;
        }
        return Promise.resolve(<p0x0>obj);
    }
}
