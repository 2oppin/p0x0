"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const p0x0_1 = require("../../p0x0/p0x0");
class p0x0generator extends p0x0_1.p0x0 {
    constructor(output = "./") {
        super();
        this._output = "./";
        this._output = output;
        return this;
    }
    get output() {
        return this._output;
    }
    get lang() {
        return this.constructor.name;
    }
    get ext() {
        return this.lang.toLowerCase();
    }
    generate(prototype, name = null) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(this.output))
                fs.mkdirSync(this.output);
            name = name || prototype.constructor.name;
            fs.writeFile(this.output + "/" + name + "." + this.ext, this.prepare(prototype, name), null, (err) => err ? reject(err) : resolve(true));
        });
    }
}
exports.p0x0generator = p0x0generator;
//# sourceMappingURL=generator.js.map