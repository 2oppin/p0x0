import {p0x0generator} from "./generator";
import {p0x0} from "../../p0x0/p0x0";
import {Entity, IEntityField} from "../../p0x0/entity";

export class sqlite extends p0x0generator {
    prepare(obj: Entity): string {
        let res =`CREATE TABLE "${obj.name}" (`,
            fields = [];
        for(let p of Object.getOwnPropertyNames(obj.fields)) {
            let d = (<IEntityField> obj.fields[p]).default || "NULL",
                v = JSON.stringify(obj[p] || "") && ` DEFAULT ${d}`,
                t = obj[p] && !isNaN(obj[p]) ? (obj[p].toString().indexOf(".") !== -1 ? "INTEGER" : "REAL") : "TEXT";
            fields.push(`\t"${p}" ${t} ${v}`);
        }
        res += fields.join(",\n") + `);`;
        return res;
    }
}