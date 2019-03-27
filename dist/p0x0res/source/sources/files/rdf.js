"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $rdf = require("rdflib");
const file_source_1 = require("./file.source");
const p0x0rdfSourceRecord_1 = require("./p0x0/p0x0rdfSourceRecord");
const p0x0helper_1 = require("../../../../p0x0helper/p0x0helper");
class rdf extends file_source_1.p0x0fileSource {
    constructor(_config = { name: "rdf" }) {
        // constructor(dir = './', baseUri = 'https://schema.org', contentType = 'application/rdf+xml') {
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
            return Promise.resolve(p0x0helper_1.p0x0helper.fill(new p0x0rdfSourceRecord_1.p0x0rdfSourceRecord, store));
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
}
exports.rdf = rdf;
//# sourceMappingURL=rdf.js.map