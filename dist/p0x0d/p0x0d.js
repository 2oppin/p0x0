"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * generator Data (usually DB, but can be rest or any other storage)
 */
const p0x0_1 = require("../p0x0/p0x0");
class p0x0d extends p0x0_1.p0x0 {
    constructor(_provider) {
        super();
        this._provider = _provider;
        this.create = (obj) => this._provider.create(obj);
        this.update = (id, obj) => this._provider.update(id, obj);
        this.get = (id) => this._provider.get(id);
        this.search = (cond) => this._provider.search(cond);
    }
}
exports.p0x0d = p0x0d;
//# sourceMappingURL=p0x0d.js.map