import {CARDINALS as p0x0CARDINALS, Entity, IVariableType} from "p0x0/entity";
import {p0x0Function} from "p0x0/p0x0Function";
import {p0x0generator} from "./generator";

export const CARDINALS = [...p0x0CARDINALS, ...p0x0CARDINALS.map((type) => `Volatile${type}`)];

export class java extends p0x0generator {
    public static mapCardinals(cardinal: string): string {
        if (!CARDINALS.includes(cardinal)) return null;

        const volatile = cardinal.match(/^Volatile[A-Z]/);
        if (volatile) cardinal = cardinal.substr(8);

        let type: string;
        switch (cardinal) {
            case "None":
                type = "void";
                break;
            case "String":
                type = cardinal;
                break;
            case "Bool":
                type = "boolean";
                break;
            default:
                type = cardinal.toLowerCase();
        }
        return `${volatile ? "volatile " : ""}${type}`;
    }

    public async prepare(obj: Entity): Promise<string> {
        const imports = obj.dependencies || {};
        let allowedTypes = [...CARDINALS, obj.name];
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
                .map(([nm, fld]) => {
                    const value = typeof fld === "string" ? fld : fld.type;
                    try {
                        return Entity.getTypeFromString(value).type;
                    } catch (e) {
                        throw new Error(`Decif failed for entity property ${obj.name}:${nm} ~  ${value}\n`);
                    }
                })
                .filter((type) =>
                    ![...importedEntities, ...CARDINALS].includes(type),
                ),
        );
        externalEntities = [...(new Set(externalEntities))];
        if (externalEntities.length) {
            /**
             *  TODO ~ search entities paths
             *  for now treat as if all encountered entities that are not listed in dependencies
             *  are from the same package
             *
            externalEntities.forEach((ent) =>
                imports[`./${ent}`] = [...(imports[`./${ent}`] || []), ent],
            );
            */
        }

        const fieldsAndMethods: string = await this.prepareFieldsAndMethods(obj, allowedTypes);
        return `package ${obj.package.replace(/^[.a-z\/]*\/?java\//, "").replace(/\//g, ".")};

${Object.entries(imports).reduce((a, [src, items]) =>
            [...a, ...items.map((item) => `import ${src}.${item};`)], [],
        ).join("\n")
}

public class ${obj.name}${obj.base ? ` extends ${obj.base}` : ""}${obj.contracts ? ` implements ${obj.contracts.join(", ")}` : ""} {
${fieldsAndMethods}
}`;
    }

    protected async prepareFieldsAndMethods(obj: Entity, allowedTypes: string[]): Promise<string> {
        return (await Promise.all(
            Object.entries(obj.fields).map(async ([p, filedValue]) =>
                this.formatVariableType(filedValue, allowedTypes, p === obj.name)
                    .then((formatter) => formatter(p))
                    .catch((e) => {
                        throw new Error(`${e.message} in entity "${obj.name}"`);
                    })
            ))
        ).join("\n");
    }

    public convertType(p0x0Type: string): string {
        let {type, arraySize, mapKey, nullable, functionArguments} = Entity.getTypeFromString(p0x0Type);
        if (CARDINALS.includes(type)) {
            type = java.mapCardinals(type);
        }
        if (mapKey) {
            if (!CARDINALS.includes(mapKey)) {
                throw Error(`"${mapKey}" can't be used as a Map key`)
            }
            type = `Map<${this.convertType(mapKey)}, ${this.convertType(type)}>`;
        } else if (arraySize) {
            type = `${this.convertType(type)}[]`;
        }

        return type;
    }

    private async formatFunction(isConstructor, varDef: IVariableType): Promise<(functionName: string) => string> {
        let prefix = `${varDef.isPrivate ? "private" : (varDef.isProtected ? "protected" : "public")} `
            + `${varDef.isStatic ? "static " : ""}${varDef.type}`;
        if (isConstructor) { // no return type declaration in Java constructor
            prefix = `public`;
        }
        if (varDef.resId || varDef.default) {
            let args, body, parent;
            if (varDef.resId) {
                const fnc: p0x0Function = await this.sources.loadInstance("p0x0Function", {ID: varDef.resId});
                args = Object.entries(fnc.arguments || []).map(([name, varType]) =>
                    `${this.convertType(varType)} ${name}`
                ).join(", ");
                body = fnc.body.toString().split("\n").map((row) => `        ${row}`).join("\n");
                parent = fnc.parent;
            } else if (varDef.default) {
                args = (varDef.functionArguments || []).map((varType, i) =>
                    `${this.convertType(varType)} arg${i}`
                ).join(", ");
                body = varDef.default.split("\n").map((row) => `        ${row}`).join("\n");
            }
            return (functionName: string) => `    ${parent ? "@Override\n    " : ""}`
                + `${prefix} ${functionName}(${args}) {\n${body}\n    }`;
        } else {
            const args: string = varDef.functionArguments.map((arg, i) => `${this.convertType(arg)} arg${i}`).join(", ");
            return (functionName: string) => `    ${prefix} ${functionName}(${args}) {\n        // TODO: implement\n    }`;
        }
    }

    private async formatVariableType(varType: string, allowedTypes: string[], isConstructor): Promise<(variableName: string) => string> {
        let varDef: IVariableType =
            Entity.getTypeFromString(varType);
        if (!varDef.type || !allowedTypes.includes(varDef.type)) {
            throw new Error(`Unknown type "${varDef.type}"`);
        }

        varDef.type = this.convertType(varType);
        if (varDef.functionArguments) {
            return this.formatFunction(isConstructor, varDef);
        }
        let body = varDef.default ? ` = ${varDef.default}` : "";
        if (varDef.resId) {
            body = ` = "${(await this.sources.loadResource(varDef.resId)).toString()
                .replace(/\\/g, `\\\\`)
                .replace(/"/g, `\\"`)
                .replace(/\r/g, `\\r`)
                .replace(/\n/g, `\\n`)
            }"`;
        }
        if (varDef.arraySize && varDef.arraySize > 0 && !body) {
            body = ` = new ${varDef.type.replace(/\W/g,'')}[${varDef.arraySize}]`;
        }

        return (variableName) => `    ${varDef.isPrivate ? "private" : (varDef.isProtected ? "protected" : "public")} `
            + `${varDef.isStatic ? "static " : ""} ${varDef.type} ${variableName}${body};`;
    }
}
