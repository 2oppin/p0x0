import {ip0x0, p0x0} from "../../../../../p0x0/p0x0";
import {p0x0rdfSourceRecordStatement} from "./ip0x0rdfSourceRecordStatement";

export interface ip0x0rdfSourceRecord extends ip0x0 {
    statements: p0x0rdfSourceRecordStatement[];
}

export class p0x0rdfSourceRecord extends p0x0 {
    statements: p0x0rdfSourceRecordStatement[] = [];
}