import * as http from 'http';
import * as jsonld from 'jsonld';
import {p0x0source} from "./source";
import {p0x0} from "../../p0x0/p0x0";

export class schemaOrg extends p0x0source {
    get(name: string): Promise<p0x0> {
        let data:Object;
        return new Promise((resolve) =>
            http.request('https://schema.org/' + name + '.xls', (data) => {
                jsonld.fromRDF(data, {format: 'application/n-quads'}, (err, doc) => {
                    resolve(<p0x0>data)
                })
            })
        );
    }

}
