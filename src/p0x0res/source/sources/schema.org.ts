import axios from "axios";
import {p0x0source} from "../source";
import {p0x0} from "../../../p0x0/p0x0";
import {rdf} from "./files/rdf";
import {p0x0rdfSourceRecord} from "./files/p0x0/p0x0rdfSourceRecord";

export class schemaOrg extends p0x0source {
    load(name: string): Promise<p0x0> {
        let data:Object;
        return axios.get('https://schema.org/' + name + '.xml')
            .then((msg) => {
                if (msg.status != 200)
                    return Promise.reject("Request failed: " + msg.status);

                return (new rdf()).convert(msg.data);
            })
            .then((src: p0x0rdfSourceRecord) => {
                let props = src.statements.filter(st => st.predicate.value == 'http://schema.org/domainIncludes'),
                    obj = {};
                for (let p of props) {
                    let nm = p.subject.value.split("/").pop();
                    obj[nm] = null;
                }
                return <p0x0>obj;
            })
            .catch(err => {
                throw err;
            });
    }

}
