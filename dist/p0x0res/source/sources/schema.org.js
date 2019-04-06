"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const source_1 = require("../source");
const rdf_1 = require("./files/rdf");
class schemaOrg extends source_1.p0x0source {
    load(name) {
        let data;
        return axios_1.default.get('https://schema.org/' + name + '.xml')
            .then((msg) => {
            if (msg.status != 200)
                return Promise.reject("Request failed: " + msg.status);
            return (new rdf_1.rdf()).convert(msg.data)
                .then((ent) => {
                ent.name = name;
                return ent;
            });
        })
            .catch(err => {
            throw err;
        });
    }
}
exports.schemaOrg = schemaOrg;
//# sourceMappingURL=schema.org.js.map