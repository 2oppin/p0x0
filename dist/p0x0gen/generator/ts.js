"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("./generator");
class ts extends generator_1.p0x0generator {
    prepare(obj, name = null) {
        name = name || obj.constructor.name;
        let res = `/**
 * Class ${name}
 */
export class ${name} {
`;
        for (let p of Object.getOwnPropertyNames(obj)) {
            let v = JSON.stringify(obj[p] || null), t = obj[p] ? (typeof obj[p]) : "any";
            res += `\tpublic ${p}: ${t} = ${v};\n`;
        }
        res += `}`;
        return res;
    }
}
exports.ts = ts;
//# sourceMappingURL=ts.js.map