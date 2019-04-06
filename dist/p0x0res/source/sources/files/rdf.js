"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $rdf = require("rdflib");
const file_source_1 = require("./file.source");
const p0x0rdfSourceRecord_1 = require("./p0x0/p0x0rdfSourceRecord");
class rdf extends file_source_1.p0x0fileSource {
    constructor(_config = { name: "rdf" }) {
        super(_config);
        this._config = _config;
        this._contentType = _config.contentType || "application/rdf+xml";
        this._baseUri = _config.baseUri || "https://schema.org";
    }
    get contentType() { return this._contentType; }
    ;
    get baseUri() { return this._baseUri; }
    ;
    convert(buff) {
        let store = $rdf.graph(), obj = {};
        try {
            $rdf.parse(buff.toString(), store, this.baseUri, this.contentType);
            return Promise.resolve(new p0x0rdfSourceRecord_1.p0x0rdfSourceRecord(store));
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
}
exports.rdf = rdf;
//# sourceMappingURL=rdf.js.map