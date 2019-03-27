import {p0x0generator} from "./generator";
import {p0x0} from "../../p0x0/p0x0";

export class sqlite extends p0x0generator {
    prepare(obj: p0x0, name:string = null): string {
        name = name || obj.constructor.name;
        let res =`CREATE TABLE "${name}" (`,
            fields = [];
        for(let p of Object.getOwnPropertyNames(obj)) {
            let v = JSON.stringify(obj[p] || "") && ` DEFAULT ` + (obj[p] === null ? 'NULL' : `"${obj[p]}"`),
                t = obj[p] && !isNaN(obj[p]) ? (obj[p].toString().indexOf(".") !== -1 ? "INTEGER" : "REAL") : "TEXT";
            fields.push(`\t"${p}" ${t} ${v}`);
        }
        res += fields.join(",\n") + `);`;
        return res;
    }
}