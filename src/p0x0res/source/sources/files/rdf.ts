import * as $rdf from 'rdflib';
import {ip0x0fileSource, ip0x0fileSourceConfig, p0x0fileSource} from "./file.source";
import {ip0x0, p0x0} from "../../../../p0x0/p0x0";
import {p0x0rdfSourceRecord} from "./p0x0/p0x0rdfSourceRecord";
import {p0x0helper} from "../../../../p0x0helper/p0x0helper";
import {ip0x0genSourceConfig} from "../../source";

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

    get contentType(): string { return this._contentType; };
    get baseUri(): string { return this._baseUri; };

    constructor(protected _config: ip0x0rdfSourceConfig = {name: "rdf"}) {
        // constructor(dir = './', baseUri = 'https://schema.org', contentType = 'application/rdf+xml') {
        super(_config);
        this._contentType = _config.contentType || "application/rdf+xml";
        this._baseUri = _config.baseUri || "https://schema.org";
    }

    convert(buff: Buffer | string): Promise<p0x0rdfSourceRecord> {
        let store = $rdf.graph(),
            obj = {};
        try {
            $rdf.parse(buff.toString(), store, this.baseUri, this.contentType);
            return Promise.resolve(<p0x0rdfSourceRecord>p0x0helper.fill(new p0x0rdfSourceRecord, store));
        } catch (err) {
            return Promise.reject(err);
        }
    }

}