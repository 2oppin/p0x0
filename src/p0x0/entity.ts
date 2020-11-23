import {Platform} from "p0x0/platform";
import {Model} from "./model";

export const CARDINALS = ["None", "String", "Int", "Float", "Bool"];

const MAP_TYPE_REG = /^(\?)?(\*)?(\+)?(@)?Map<\s*([A-Za-z][A-Za-z\d]+)\s*,\s*([A-Za-z][A-Za-z\d]+)(\[\d*\])*(\([^)]*\))*\s*>(&?=(.|[\r\n]))*$/;
const OTHER_TYPE_REG = /^(\?)?(\*)?(\+)?(@)?([A-Za-z][A-Za-z\d]*)(\[\d*\])*(\([^)]*\))*(&?=((.|[\r\n])+))*$/;

export interface IVariableType {
    type: string;
    arraySize: number|null;
    mapKey: string|null;
    functionArguments: string[]|null;
    isPrivate: boolean;
    isProtected: boolean;
    isStatic: boolean;
    nullable: boolean;
    resId: string|null;
    default: string|null;
}

export class Entity extends Model {
    public static getTypeFromString(
        propValue: string,
    ): IVariableType {
        let arraySize, functionArguments, dfault, resOrText;
        let nullable, isPrivate, isProtected, isStatic, mapKey, type;

        const isMapMatches = propValue.match(MAP_TYPE_REG);
        if (isMapMatches) {
            [, nullable, isPrivate, isProtected, isStatic, mapKey, type, arraySize, functionArguments, , resOrText, dfault] = isMapMatches;
        } else {
            [, nullable, isPrivate, isProtected, isStatic, type, arraySize, functionArguments, resOrText, dfault] =
                propValue.match(OTHER_TYPE_REG);
        }
        resOrText = resOrText && resOrText[0] === "&";
        arraySize = arraySize && ((+arraySize.substr(1, arraySize.length - 2)) || -1)
        functionArguments = functionArguments ? functionArguments.replace(/[()]/g, "").split(",").map(v => v.trim()) : null
        mapKey = isMapMatches ? mapKey : null;
        return {type, arraySize, mapKey, functionArguments, isPrivate, isProtected, isStatic, nullable,
            resId: resOrText ? dfault : null,
            default: resOrText ? null : dfault,
        };
    }

    public name: string;
    public package?: string;
    public base?: string;
    public contracts?: string[];
    public dependencies?: {[key: string]: string[]};
    public fields: {[field: string]: string};
    public platforms: Platform[];
    constructor(data = {}) {
        super({name: "", base: null, dependencies: [], ...data});
    }
}
