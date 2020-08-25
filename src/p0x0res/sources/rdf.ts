import * as $rdf from "rdflib";
import Formula from "rdflib/lib/formula";
import {ip0x0fileSource, ip0x0fileSourceConfig, p0x0fileSource} from "./files/file.source";
import {p0x0rdfSourceRecord} from "./files/rdf/p0x0rdfSourceRecord";

export interface  ip0x0rdfSourceConfig extends ip0x0fileSourceConfig {
    dir?: string;
    baseUri?: string;
    contentType?: string;
}

export interface irdf extends ip0x0fileSource {
    contentType: string;
    baseUri: string;
}

export class rdf extends p0x0fileSource implements irdf {
    protected _contentType: string;
    protected _baseUri: string;

    get contentType(): string { return this._contentType; }
    get baseUri(): string { return this._baseUri; }

    constructor(protected config: ip0x0rdfSourceConfig = null) {
        super(config);
        if (this.config) {
            this._contentType = config.contentType || "application/rdf+xml";
            this._baseUri = config.baseUri || "https://schema.org";
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
