import {Utils} from "utils/utils";

export abstract class Model {
    constructor(data: any = {}) {
        this.populate(data);
    }

    public populate(data: any) {
        for (let i = 0, a = Object.getOwnPropertyNames(data); i < a.length; i++) {
            if (typeof data[a[i]] === "function") {
                this[a[i]] = data[a[i]].bind(this);
            } else {
                this[a[i]] = Utils.deepCopy(data[a[i]]);
            }
        }
        return this;
    }

    get list(): any {
        const res: any = {};
        for (const p of Object.getOwnPropertyNames(this)) {
            res[p] = (this as any)[p];
        }
        return res;
    }
}
