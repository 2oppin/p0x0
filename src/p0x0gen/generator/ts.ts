import {ip0x0genGeneratorConfig, p0x0generator} from "./generator";
import {Entity, IEntityField} from "../../p0x0/entity";

export interface ip0x0genTsConfig extends ip0x0genGeneratorConfig {
    imports?: Array<string>;
    baseClass?: string;
}

export class ts extends p0x0generator {
    constructor(protected _output:string = "./", protected _config: ip0x0genTsConfig = {lang: "ts"}) {
        super();
    }

    prepare(obj: Entity): string {
        let imports = this._config.imports ? `import {${this._config.imports.join(", ")}} from "./imports";\n\n` : "",
            extend = this._config.baseClass ? `extends ${this._config.baseClass}` : "",
            res =
`${imports}/**
 * Class ${obj.name}
 */
export class ${obj.name} ${extend}{
`;
        for(let p of Object.getOwnPropertyNames(obj.fields)) {
            let v = JSON.stringify((<IEntityField> obj.fields[p]).default || null),
                t: string = (<IEntityField> obj.fields[p]).type ||  (<string> obj.fields[p]),
                allowedTypes = (this._config.imports || []).concat(...["number", "string", "Date"]);
            if (!allowedTypes.includes(t)) t = "any";
            res += `\tpublic ${p}: ${t} = ${v};\n`;
        }
res += `}`;
        return res;
    }
}