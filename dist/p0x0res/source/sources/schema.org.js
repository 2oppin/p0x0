"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
const source_1 = require("../source");
const rdf_1 = require("./files/rdf");
class schemaOrg extends source_1.p0x0source {
    load(name) {
        let data;
        return new Promise((resolve, reject) => {
            https.get('https://schema.org/' + name, { headers: { 'Content-Type': 'application/json' } }, (res) => {
                // res.setEncoding("utf8");
                if (res.statusCode < 200 || res.statusCode >= 400) {
                    return reject(res.statusCode);
                }
                let body = "";
                res.on("data", data => {
                    body += data;
                });
                res.on("end", () => {
                    try {
                        body = JSON.parse(body);
                    }
                    catch (e) {
                        return reject(e);
                    }
                    resolve(body);
                });
            }).on('error', reject);
        }).then((msg) => {
            return (new rdf_1.rdf({ name })).convert(msg)
                .then((ent) => {
                ent.type = name;
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
