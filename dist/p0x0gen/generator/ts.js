"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("./generator");
class ts extends generator_1.p0x0generator {
    constructor(_output = "./", _config = { lang: "ts" }) {
        super();
        this._output = _output;
        this._config = _config;
    }
    prepare(obj) {
        let imports = this._config.imports ? `import { ${this._config.imports.join(", ")} } from "./imports";\n\n` : "", allowedTypes = (this._config.imports || []).concat(...["number", "string", "Date"]), base = (obj.base && obj.base.name) || this._config.baseClass || null, using = (obj.using || []).concat(...(base && !allowedTypes.includes(base) && [base]) || []), extend = base ? `extends ${base} ` : "";
        if (using.length) {
            imports += using.map(u => `import { ${u} } from "./${u}";`).join("\n") + "\n";
            allowedTypes.concat(...using);
        }
        let fields = obj.fields, fieldsNames = Object.getOwnPropertyNames(fields), res = `${imports}/**
 * Class ${obj.name}
 */
export class ${obj.name} ${extend}{
`;
        for (let p of fieldsNames) {
            let v = JSON.stringify((fields[p] && fields[p].default) || null), t = fields[p].type || obj.fields[p];
            if (!t || !allowedTypes.includes(t.replace(/[\[\]]]/, "")))
                t = "any";
            res += `    public ${p}: ${t} = ${v};\n`;
        }
        res += `}`;
        return res;
    }
}
exports.ts = ts;
//# sourceMappingURL=ts.js.map