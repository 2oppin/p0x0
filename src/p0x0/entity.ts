import {Model} from "./model";
export interface IEntityField {
    type: string;
    default?: any;
}
export interface IEntityFields {
    [field: string]: IEntityField|string;
}
export class Entity extends Model {
    public name: string;
    public base?: Entity;
    public using?: string[];
    public fields: IEntityFields;
    constructor(data = {}) {
        super({name: "", base: null, using: [], ...data});
    }
}
