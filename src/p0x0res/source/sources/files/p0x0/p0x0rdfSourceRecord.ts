import {Entity, IEntityFields} from "p0x0/entity";
import {ip0x0} from "p0x0/p0x0";
import {p0x0rdfSourceRecordStatement} from "./ip0x0rdfSourceRecordStatement";

export interface ip0x0rdfSourceRecord extends ip0x0 {
    statements: p0x0rdfSourceRecordStatement[];
}

export class p0x0rdfSourceRecord extends Entity {
    private _fields: IEntityFields;

    constructor(public statements: p0x0rdfSourceRecordStatement[]) {
        super();
        this._fields = {};
        if (statements.length) {
            this.name = statements[0].object.value.split("/").pop();
        }
        for (const p of this.statements) {
            const nm = p.subject.value.split("/").pop();
            this._fields[nm] = {type: "String", default: null};
        }
    }
    get fields(): IEntityFields {
        return this._fields;
    }
}
