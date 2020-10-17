import {CARDINALS, Entity} from "p0x0/entity";
import {p0x0Function} from "p0x0/p0x0Function";
import {p0x0generator} from "./generator";

export class ts extends p0x0generator {
    public static mapCardinals(cardinal: string): string {
        if (!CARDINALS.includes(cardinal)) return null;

        switch (cardinal) {
            case "None": return "void";
            case "Float":
            case "Int": return "number";
            default:
                return cardinal.toLowerCase();
        }
    }

    public async prepare(obj: Entity): Promise<string> {
        const imports = obj.dependencies || {};
        const allowedTypes = [...CARDINALS.map(ts.mapCardinals), obj.name];
        const base: string = obj.base || null,
            extend = base ? `extends ${base} ` : "";
        const fields: {[name: string]: string|any} = obj.fields,
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
                .map(([, fld]) => {
                    const value = typeof fld === "string" ? fld : fld.type;
                    return Entity.getTypeFromString(value)[0];
                })
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
            let [type, isArray, mapKey, funcArgs, isPrivate, isProtected, isStatic, dfault] =
                Entity.getTypeFromString(fields[p].type || (obj.fields[p] as string));
            if (CARDINALS.includes(type)) {
                type = ts.mapCardinals(type);
            }
            if (!type || !allowedTypes.includes(type)) {
                type = "any";
            }
            if (mapKey) {
                if (!allowedTypes.includes(mapKey)) mapKey = "string";
                type = `Map<${mapKey}, ${type}>`;
            } else if (isArray) {
                type = `${type}[]`;
            } else if (funcArgs) {
                if (dfault) {
                    const fnc: p0x0Function = await this.sources.loadInstance("p0x0Function", {ID: dfault});
                    const args = Object.entries(fnc.arguments)
                        .map(([name, varType]) => `${varType} ${name}`).join(", ");
                    const body = fnc.body.split("\n").map((row) => `        ${row}`).join("\n");
                    return `${isPrivate ? "private" : (isProtected ? "protected" : "public")} `
                        + `${isStatic ? "static " : ""} ${p}(${args}): ${type} {\n${body}\n    }`;
                } else {
                    const args = funcArgs.map((arg, i) => `${arg} arg${i}`).join(", ");
                    return `    ${isPrivate ? "private" : (isProtected ? "protected" : "public")} `
                        + `${isStatic ? "static " : ""} ${p}(${args}):${type} {\n    // TODO: implement\n}`;
                }
            }
            res += `    public ${p}: ${type}${v && ` = ${v}`};\n`;
        }
        res += `}\n`;
        return res;
    }
}
