import {CARDINALS, Entity, IEntityField} from "../../p0x0/entity";
import {p0x0generator} from "./generator";

export class ts extends p0x0generator {
    public static mapCardinals(cardinal: string): string {
        if (!CARDINALS.includes(cardinal)) return null;

        switch (cardinal) {
            case "Float":
            case "Int": return "number";
            default:
                return cardinal.toLowerCase();
        }
    }

    constructor(protected _output: string = "./") {
        super();
    }

    public prepare(obj: Entity): string {
        const imports = obj.dependencies || {};
        const allowedTypes = [...CARDINALS.map(ts.mapCardinals), obj.name];
        const base: string = obj.base || null,
            extend = base ? `extends ${base} ` : "";
        const fields: {[name: string]: IEntityField|string|any} = obj.fields,
            fieldsNames = Object.getOwnPropertyNames(fields);
        const importedEntities = [
            ...Object.entries(imports).reduce((a, [, entities]) =>
                [...a, ...entities],
                [],
            ),
        ];
        let externalEntities = [];
        if (base) {
            if (!importedEntities.includes(base)) {
                externalEntities.push(base);
            }
            allowedTypes.push(base);
        }
        externalEntities.concat(
            ...Object.entries(fields)
                .map(([, value]) => Entity.getTypeFromString(value)[0])
                .filter((type) =>
                    ![...importedEntities, ...CARDINALS].includes(type),
                ),
        );
        externalEntities = [...(new Set(externalEntities))];
        if (externalEntities.length) {
            // TODO ~ search entities paths
            externalEntities.forEach((ent) =>
                imports[`./${ent}`] = [...(imports[`./${ent}`] || []), ent],
            );
        }
        let res =
`${Object.entries(imports).map(([path, entities]) => {
    allowedTypes.concat(...entities);
    return `import {${entities.join(", ")}} from "${path}";`;
}).join("\n")}

export class ${obj.name} ${extend ? `${extend} ` : ""}{
`;
        for (const p of fieldsNames) {
            const v = fields[p] && fields[p].default
                ? JSON.stringify(fields[p].default)
                : "";
            // tslint:disable-next-line:prefer-const
            let [tsType, isArray, mapKey, isFunction] =
                Entity.getTypeFromString(fields[p].type || (obj.fields[p] as string));
            if (CARDINALS.includes(tsType)) {
                tsType = ts.mapCardinals(tsType);
            }
            if (!tsType || !allowedTypes.includes(tsType)) {
                tsType = "any";
            }
            if (mapKey) {
                if (!allowedTypes.includes(mapKey)) mapKey = "string";
                tsType = `Map<${mapKey}, ${tsType}>`;
            } else if (isArray) {
                tsType = `${tsType}[]`;
            } else if (isFunction) {
                tsType = "(..args?: any) => any";
            }
            res += `    public ${p}: ${tsType}${v && ` = ${v}`};\n`;
        }
        res += `}\n`;
        return res;
    }
}
