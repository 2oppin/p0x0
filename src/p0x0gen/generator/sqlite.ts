import {Entity} from "../../p0x0/entity";
import {p0x0generator} from "./generator";

export class sqlite extends p0x0generator {
    public prepare(obj: Entity): string {
        let res = `CREATE TABLE "${obj.name}" (`;
        const names = Object.getOwnPropertyNames(obj.fields);
        const fields: {[name: string]: string|any} = obj.fields;
        const columns = [];

        /* TODO fix collecting fields from parent(base Entity)
         // tslint:disable-next-line:jsdoc-format
        for (let base = obj.base ; base && base.fields; base = base.base) {
            const baseFields = base.fields;
            names = names.concat(Object.getOwnPropertyNames(baseFields));
        }
        */
        for (const p of names) {
            const d = (fields[p] && fields[p].default) || "NULL",
                v = JSON.stringify(obj[p] || "") && ` DEFAULT ${d}`,
                t = (fields[p] && fields[p].default) && !isNaN(d) ? (d.toString().indexOf(".") !== -1 ? "INTEGER" : "REAL") : "TEXT";
            columns.push(`\t"${p}" ${t} ${v}`);
        }
        res += columns.join(",\n") + `);`;
        return res;
    }
}
