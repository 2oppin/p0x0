"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const p0x0_1 = require("../p0x0/p0x0");
class p0x0helper extends p0x0_1.p0x0 {
    static fill(obj, data, name = null) {
        for (const prop of Object.getOwnPropertyNames(obj)) {
            if (data[prop] !== undefined) {
                obj[prop] = data[prop];
            }
        }
        return obj;
    }
}
exports.p0x0helper = p0x0helper;
//# sourceMappingURL=p0x0helper.js.map