import {ip0x0, p0x0} from "../../../../../p0x0/p0x0";

export interface ip0x0rdfSourceRecordStatementNode extends ip0x0 {
    termType: string;
    value: string;
}

export class p0x0rdfSourceRecordStatementNode extends p0x0 implements ip0x0rdfSourceRecordStatementNode {
    termType: string = null;
    value: string = null;
}