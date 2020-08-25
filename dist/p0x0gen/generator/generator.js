"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const p0x0_1 = require("p0x0/p0x0");
class p0x0generator extends p0x0_1.p0x0 {
    constructor(_output = "./", _config = null) {
        super();
        this._output = _output;
        this._config = _config;
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
    generate(prototype) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(this.output)) {
                fs.mkdirSync(this.output);
            }
            fs.writeFile(this.output + "/" + prototype.name + "." + this.ext, this.prepare(prototype), null, (err) => err ? reject(err) : resolve(true));
        });
    }
}
exports.p0x0generator = p0x0generator;
//# sourceMappingURL=generator.js.map