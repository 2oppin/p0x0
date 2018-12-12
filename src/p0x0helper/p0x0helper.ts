import {p0x0} from "../p0x0/p0x0";

export class p0x0helper extends p0x0 {
    static fill(obj:p0x0, data:Object, name: string = null): p0x0 {
        for (let prop of Object.getOwnPropertyNames(obj))
            if (data[prop] !== undefined)
                obj[prop] = data[prop];

        return obj;
    }
}