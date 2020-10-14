import {Platform} from "p0x0/platform";
import {Model} from "./model";

export const CARDINALS = ["None", "String", "Int", "Float", "Boolean"];

export interface IEntityFields {
    [field: string]: string;
}
const MAP_TYPE_REG = /^(\*)?(\+)?(@)?Map<\s*([A-Za-z][A-Za-z\d]+)\s*,\s*([A-Za-z][A-Za-z\d]+)(\[\])*(\([^)]*\))*\s*>(=(.+))*$/;
const OTHER_TYPE_REG = /^(\*)?(\+)?(@)?([A-Za-z][A-Za-z\d]*)(\[\])*(\([^)]*\))*(=(.+))*$/;

export class Entity extends Model {
    public static getTypeFromString(
        propValue: string,
    ): [string, boolean, string|null, string[]|null, boolean, boolean, boolean, string] {
        let isArray: any = false, functionArguments: any = false, dfault: string;
        let isPrivate, isProtected, isStatic, mapKey, type;

        const isMapMatches = propValue.match(MAP_TYPE_REG);
        if (isMapMatches) {
            [, isPrivate, isProtected, isStatic, mapKey, type, isArray, functionArguments, , dfault] = isMapMatches;
        } else {
            [, isPrivate, isProtected, isStatic, type, isArray, functionArguments, , dfault] =
                propValue.match(OTHER_TYPE_REG);
        }
        return [
            type,
            !!isArray,
            isMapMatches ? mapKey : null,
            functionArguments ? functionArguments.replace(/[()]/g, "").split(",") : null,
            !!isPrivate, !!isProtected, !!isStatic,
            dfault,
        ];
    }

    public name: string;
    public package?: string;
    public base?: string;
    public dependencies?: {[key: string]: string[]};
    public fields: IEntityFields;
    public platforms: Platform[];
    constructor(data = {}) {
        super({name: "", base: null, dependencies: [], ...data});
    }
}
