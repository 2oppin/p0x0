"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_source_1 = require("./files/file.source");
class json extends file_source_1.p0x0fileSource {
    convert(buff) {
        let ent = JSON.parse(buff.toString());
        return Promise.resolve(ent);
    }
}
exports.json = json;
//# sourceMappingURL=json.js.map