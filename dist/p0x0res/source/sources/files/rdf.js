"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $rdf = require("rdflib");
const file_source_1 = require("./file.source");
const p0x0rdfSourceRecord_1 = require("./p0x0/p0x0rdfSourceRecord");
class rdf extends file_source_1.p0x0fileSource {
    constructor(config) {
        super(config);
        this.config = config;
        this._contentType = config.contentType || "application/rdf+xml";
        this._baseUri = config.baseUri || "https://schema.org";
    }
    get contentType() { return this._contentType; }
    get baseUri() { return this._baseUri; }
    convert(buff) {
        const store = $rdf.graph();
        try {
            $rdf.parse(buff.toString(), store, this._baseUri, this._contentType);
            return Promise.resolve(new p0x0rdfSourceRecord_1.p0x0rdfSourceRecord(this.config.name, store.statements));
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
}
exports.rdf = rdf;
//# sourceMappingURL=rdf.js.map