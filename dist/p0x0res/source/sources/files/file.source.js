"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const source_1 = require("../../source");
class p0x0fileSource extends source_1.p0x0source {
    constructor(_config = null) {
        super();
        this.config = _config;
        if (this._config && this._config.dir) {
            this._dir = this._config.dir;
            if (this._dir.match(/^\.\//))
                this._dir = process.cwd() + "/" + this._dir.slice(2);
        }
    }
    get dir() { return this._dir; }
    get ext() {
        return this.name;
    }
    load(name) {
        return new Promise((resolve, reject) => fs.readdir(this._dir, null, (err, files) => {
            if (err)
                return reject(err);
            let p0x0FileName = name + "." + this.ext, p0x0File = files
                .find(n => n == p0x0FileName);
            if (!p0x0File)
                return reject(this._dir + "/" + p0x0FileName + " not found.");
            let buff;
            try {
                buff = fs.readFileSync(this._dir + "/" + p0x0File);
            }
            catch (e) {
                return reject(e);
            }
            return resolve(this.convert(buff));
        }));
    }
}
exports.p0x0fileSource = p0x0fileSource;
//# sourceMappingURL=file.source.js.map
