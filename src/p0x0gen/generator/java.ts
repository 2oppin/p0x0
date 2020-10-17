import {CARDINALS, Entity} from "p0x0/entity";
import {p0x0Function} from "p0x0/p0x0Function";
import {p0x0generator} from "./generator";

export class java extends p0x0generator {
    public static mapCardinals(cardinal: string): string {
        if (!CARDINALS.includes(cardinal)) return null;

        switch (cardinal) {
            case "None":
                return "void";
            case "String":
                return cardinal;
            default:
                return cardinal.toLowerCase();
        }
    }

    public async prepare(obj: Entity): Promise<string> {
        const imports = obj.dependencies || {};
        let allowedTypes = [...CARDINALS.map(java.mapCardinals), obj.name];
        const base: string = obj.base || null;
        const fields: {[name: string]: string|any} = obj.fields;
        const importedEntities = [
            ...Object.entries(imports).reduce((a, [, entities]) =>
                    [...a, ...entities],
                [],
            ),
        ];
        allowedTypes = [...allowedTypes, ...importedEntities];
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

        const fieldsAndMethods: string = await this.prepareFieldsAndMethods(obj, allowedTypes);
        return `package ${obj.package.replace(/^[a-z\/]*\/?java\//, "").replace(/\//g, ".")};

${Object.entries(imports).reduce((a, [src, items]) =>
            [...a, ...items.map((item) => `import ${src}.${item}`)], [],
        ).join("\n")
}

public class ${obj.name}${obj.base ? ` extends ${obj.base}` : ""} {
${fieldsAndMethods}
}`;
    }

    protected async prepareFieldsAndMethods(obj: Entity, allowedTypes: string[]): Promise<string> {
        return (await Promise.all(
            Object.entries(obj.fields).map(async ([p, filedValue]) => {
                // tslint:disable-next-line:prefer-const
                let [type, isArray, mapKey, funcArgs, isPrivate, isProtected, isStatic, dfault] =
                    Entity.getTypeFromString(filedValue);
                if (CARDINALS.includes(type)) {
                    type = java.mapCardinals(type);
                }
                if (!type || !allowedTypes.includes(type)) {
                    throw new Error(`Unknown type (${type}) in entity (${obj.name})`);
                }
                if (funcArgs) {
                    if (dfault) {
                        const fnc: p0x0Function = await this.sources.loadInstance("p0x0Function", {ID: dfault});
                        const args = Object.entries(fnc.arguments).map(([name, varType]) => `${varType} ${name}`).join(", ");
                        const body = fnc.body.split("\n").map((row) => `        ${row}`).join("\n");
                        return `    ${fnc.parent ? "@Override\n    " : ""}`
                            + `${isPrivate ? "private" : (isProtected ? "protected" : "public")} `
                            + `${isStatic ? "static " : ""}${type} ${p}(${args}) {\n${body}\n    }`;
                    } else {
                        const args = funcArgs.map((arg, i) => `${arg} arg${i}`).join(", ");
                        return `    ${isPrivate ? "private" : (isProtected ? "protected" : "public")} `
                            + `${isStatic ? "static " : ""}${type} ${p}(${args}) {\n    // TODO: implement\n}`;
                    }
                }
                if (mapKey) {
                    if (!allowedTypes.includes(mapKey)) mapKey = "String";
                    type = `Map<${mapKey}, ${type}>`;
                } else if (isArray) {
                    type = `${type}[]`;
                }
                return `    ${isPrivate ? "private" : (isProtected ? "protected" : "public")} `
                    + `${isStatic ? "static " : ""}${p} ${type}${dfault ? ` = ${dfault}` : ""};`;
            }))
        ).join("\n");
    }
}
