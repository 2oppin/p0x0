import {Model} from "./model";

export const CARDINALS = ["String", "Int", "Float", "Boolean"];

export interface IEntityField {
    type: string;
    default?: any;
}
export interface IEntityFields {
    [field: string]: IEntityField|string;
}
const ALL_TYPE_REG = /(Map<[A-Za-z][A-Za-z\d]*,\s*)*([A-Za-z][A-Za-z\d]*)>?(\[\])*(\([^)]*\))*/;
const MAP_KYE_REG = /Map(<[A-Za-z][A-Za-z\d]*),\s*/;
export class Entity extends Model {
    public static getTypeFromString(propValue: string): [string, boolean, string|null, boolean] {
        const [, mapKey, type, isArray, isFunction] =
            propValue.match(ALL_TYPE_REG);
        return [
            type,
            !!isArray,
            mapKey ? mapKey.match(MAP_KYE_REG)[1] : null,
            !!isFunction,
        ];
    }

    public name: string;
    public base?: string;
    public dependencies?: {[key: string]: string[]};
    public fields: IEntityFields;
    public methods: string[];
    constructor(data = {}) {
        super({name: "", base: null, using: [], ...data});
    }
}
