import * as $rdf from "rdflib";
import Formula from "rdflib/lib/formula";
import {p0x0convertor} from "../convertor";
import {ip0x0genResourceConfig} from "../source";
import {p0x0rdfSourceRecord} from "../sources/files/rdf/p0x0rdfSourceRecord";

export interface  ip0x0rdfSourceConfig extends ip0x0genResourceConfig {
    baseUri?: string;
    contentType?: string;
}

export class rdf extends p0x0convertor {
    protected _contentType: string = "application/rdf+xml";
    protected _baseUri: string = "https://schema.org";

    get contentType(): string { return this._contentType; }
    get baseUri(): string { return this._baseUri; }

    constructor(protected config: ip0x0rdfSourceConfig = null) {
        super();
        if (this.config) {
            this._contentType = config.contentType || this._contentType;
            this._baseUri = config.baseUri || this._baseUri;
        }
    }

    public convert(buff: Buffer | string): Promise<p0x0rdfSourceRecord> {
        const store: Formula = $rdf.graph();
        try {
            $rdf.parse(buff.toString(), store, this._baseUri, this._contentType);
            return Promise.resolve(new p0x0rdfSourceRecord(store.statements));
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
