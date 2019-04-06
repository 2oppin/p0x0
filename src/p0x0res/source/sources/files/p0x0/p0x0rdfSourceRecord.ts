import {ip0x0, p0x0} from "../../../../../p0x0/p0x0";
import {p0x0rdfSourceRecordStatement} from "./ip0x0rdfSourceRecordStatement";
import {Entity, IEntityFields} from "../../../../../p0x0/entity";

export interface ip0x0rdfSourceRecord extends ip0x0 {
    statements: p0x0rdfSourceRecordStatement[];
}

export class p0x0rdfSourceRecord extends Entity {
    name: string = "p0x0rdfSourceRecord";
    statements: p0x0rdfSourceRecordStatement[] = [];
    get fields(): IEntityFields {
        let fields: IEntityFields = {};

        for (let p of this.statements) {
            let nm = p.subject.value.split("/").pop();
            fields[nm] = {type: "String", default: null};
        }
        return fields;
    }
}