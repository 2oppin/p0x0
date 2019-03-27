"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("./generator");
class sqlite extends generator_1.p0x0generator {
    prepare(obj, name = null) {
        name = name || obj.constructor.name;
        let res = `CREATE TABLE "${name}" (`, fields = [];
        for (let p of Object.getOwnPropertyNames(obj)) {
            let v = JSON.stringify(obj[p] || "") && ` DEFAULT ` + (obj[p] === null ? 'NULL' : `"${obj[p]}"`), t = obj[p] && !isNaN(obj[p]) ? (obj[p].toString().indexOf(".") !== -1 ? "INTEGER" : "REAL") : "TEXT";
            fields.push(`\t"${p}" ${t} ${v}`);
        }
        res += fields.join(",\n") + `);`;
        return res;
    }
}
exports.sqlite = sqlite;
//# sourceMappingURL=sqlite.js.map