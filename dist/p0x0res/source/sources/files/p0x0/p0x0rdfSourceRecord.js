"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("p0x0/entity");
class p0x0rdfSourceRecord extends entity_1.Entity {
    constructor(name, statements) {
        super();
        this.name = name;
        this.statements = statements;
    }
    get fields() {
        const fields = {};
        for (const p of this.statements) {
            const nm = p.subject.value.split("/").pop();
            fields[nm] = { type: "String", default: null };
        }
        return fields;
    }
}
exports.p0x0rdfSourceRecord = p0x0rdfSourceRecord;
//# sourceMappingURL=p0x0rdfSourceRecord.js.map