"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("./generator");
class sqlite extends generator_1.p0x0generator {
    prepare(obj) {
        let res = `CREATE TABLE "${obj.name}" (`, names = Object.getOwnPropertyNames(obj.fields), fields = obj.fields, columns = [];
        for (let base = obj.base; base && base.fields; base = base.base) {
            const baseFields = base.fields;
            names = names.concat(Object.getOwnPropertyNames(baseFields));
        }
        for (let p of names) {
            let d = (fields[p] && fields[p].default) || "NULL", v = JSON.stringify(obj[p] || "") && ` DEFAULT ${d}`, t = (fields[p] && fields[p].default) && !isNaN(d) ? (d.toString().indexOf(".") !== -1 ? "INTEGER" : "REAL") : "TEXT";
            columns.push(`\t"${p}" ${t} ${v}`);
        }
        res += columns.join(",\n") + `);`;
        return res;
    }
}
exports.sqlite = sqlite;
//# sourceMappingURL=sqlite.js.map