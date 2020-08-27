import {Entity, IEntityField} from "../../p0x0/entity";
import {ip0x0genGeneratorConfig, p0x0generator} from "./generator";

export interface ip0x0genTsConfig extends ip0x0genGeneratorConfig {
    imports?: string[];
    baseClass?: string;
}

export class ts extends p0x0generator {
    constructor(protected _output: string = "./", protected _config: ip0x0genTsConfig = {lang: "ts"}) {
        super();
    }

    public prepare(obj: Entity): string {
        let imports = this._config.imports ? `import { ${this._config.imports.join(", ")} } from "./imports";\n\n` : "";
        const allowedTypes = (this._config.imports || []).concat(...["number", "string", "Date"]),
            base: string = (obj.base && obj.base.name) || this._config.baseClass || null,
            using = (obj.using || []).concat(...(base && !allowedTypes.includes(base) && [base]) || []),
            extend = base ? `extends ${base} ` : "";
        if (using.length) {
            imports += using.map((u) => `import { ${u} } from "./${u}";`).join("\n") + "\n";
            allowedTypes.concat(...using);
        }
        const fields: {[name: string]: IEntityField|string|any} = obj.fields,
            fieldsNames = Object.getOwnPropertyNames(fields);
        let res =
`${imports}/**
 * Class ${obj.name}
 */
export class ${obj.name} ${extend}{
`;
        for (const p of fieldsNames) {
            const v = JSON.stringify((fields[p] && fields[p].default) || null);
            let t: string = fields[p].type ||  (obj.fields[p] as string);
            if (!t || !allowedTypes.includes(t.replace(/[\[\]]]/, ""))) t = "any";
            res += `    public ${p}: ${t} = ${v};\n`;
        }
        res += `}\n`;
        return res;
    }
}
