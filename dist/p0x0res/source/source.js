"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const p0x0_1 = require("../../p0x0/p0x0");
class p0x0source extends p0x0_1.p0x0 {
    constructor(_config = null) {
        super();
        this.config = _config;
    }
    get name() {
        return this.constructor.name.replace(/[A-Z]/, (s) => '.' + s.toLowerCase());
    }
}
exports.p0x0source = p0x0source;
//# sourceMappingURL=source.js.map
