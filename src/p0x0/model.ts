import {Utils} from "../utils/utils";

type IModel = new () => Model;
export abstract class Model {
    public _id;
    constructor(data?: any) {
        if (data)
            this.populate(data);
    }

    public populate(data: any) {
        for (let i = 0, a = Object.getOwnPropertyNames(data); i < a.length; i++) {
            // for (let a of Object.getOwnPropertyNames(data))
            if (typeof data[a[i]] === "function") {
                this[a[i]] = data[a[i]];
            } else
                this[a[i]] = Utils.deepCopy(data[a[i]]);
        }
        return this;
    }

    get list(): any {
        const res: any = {};
        for (const p of Object.getOwnPropertyNames(this))
            res[p] = (<any> this)[p];
        return res;
    }
}