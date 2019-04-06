"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sources_1 = require("./sources");
const files_1 = require("./sources/files");
var _sourceTypes = {};
for (let srct of sources_1._sources.concat(files_1._files)) {
    _sourceTypes[(new srct()).name] = srct;
}
exports.sourceTypes = _sourceTypes;
//# sourceMappingURL=index.js.map