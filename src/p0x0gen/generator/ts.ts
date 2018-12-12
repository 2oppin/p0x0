import {p0x0generator} from "./generator";
import {p0x0} from "../../p0x0/p0x0";

export class ts extends p0x0generator {
    prepare(obj: p0x0, name:string = null): string {
        name = name || obj.constructor.name;
        let res =
`/**
 * Class ${name}
 */
export class ${name} {
`;
        for(let p of Object.getOwnPropertyNames(obj)) {
            let v = JSON.stringify(obj[p] || null),
                t = obj[p] ? (typeof obj[p]) : "any";
            res += `\tpublic ${p}: ${t} = ${v};\n`;
        }
res += `}`;
        return res;
    }
}