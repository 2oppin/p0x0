"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const p0x0_1 = require("../../p0x0/p0x0");
class p0x0genConfig extends p0x0_1.p0x0 {
    constructor() {
        super(...arguments);
        this.generators = ['ts'];
        this.output = 'generator/';
        this.prototypes = [];
        this.sources = [{
                name: "schema.org"
            }];
    }
    validate() {
        let rules = [
            () => this.output.search(/\.\.\//) == -1
        ];
        for (let r of rules)
            if (!r())
                return false;
        return true;
    }
}
exports.p0x0genConfig = p0x0genConfig;
//# sourceMappingURL=config.js.map