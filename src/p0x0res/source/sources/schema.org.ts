import axios from "axios";
import {p0x0source} from "../source";
import {p0x0} from "../../../p0x0/p0x0";
import {rdf} from "./files/rdf";
import {p0x0rdfSourceRecord} from "./files/p0x0/p0x0rdfSourceRecord";
import {Entity} from "../../../p0x0/entity";

export class schemaOrg extends p0x0source {
    load(name: string): Promise<Entity> {
        let data:Object;
        return axios.get('https://schema.org/' + name + '.xml')
            .then((msg) => {
                if (msg.status != 200)
                    return Promise.reject("Request failed: " + msg.status);

                return (new rdf()).convert(msg.data);
            })
            .catch(err => {
                throw err;
            });
    }

}
