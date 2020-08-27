"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
class Model {
    constructor(data) {
        if (data) {
            this.populate(data);
        }
    }
    populate(data) {
        for (let i = 0, a = Object.getOwnPropertyNames(data); i < a.length; i++) {
            // for (let a of Object.getOwnPropertyNames(data))
            if (typeof data[a[i]] === "function") {
                this[a[i]] = data[a[i]];
            }
            else {
                this[a[i]] = utils_1.Utils.deepCopy(data[a[i]]);
            }
        }
        return this;
    }
    get list() {
        const res = {};
        for (const p of Object.getOwnPropertyNames(this)) {
            res[p] = this[p];
        }
        return res;
    }
}
exports.Model = Model;
//# sourceMappingURL=model.js.map