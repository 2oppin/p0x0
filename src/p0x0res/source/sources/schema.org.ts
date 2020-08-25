import * as https from "https";
import {Entity} from "p0x0/entity";
import {p0x0source} from "../source";
import {rdf} from "./files/rdf";

export class schemaOrg extends p0x0source {
    public load(name: string): Promise<Entity> {
        return new Promise<string>((resolve, reject) => {
            https.get("https://schema.org/" + name, {headers: {"Content-Type": "application/json"}}, (res) => {
                // res.setEncoding("utf8");
                if (res.statusCode < 200 || res.statusCode >= 400) {
                    return reject(res.statusCode);
                }
                let body = "";
                res.on("data", (data) => {
                    body += data;
                });
                res.on("end", () => {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {
                        return reject(e);
                    }
                    resolve(body);
                });
            }).on("error", reject);
        }).then((msg: string) => {
                return (new rdf({name})).convert(msg)
                    .then((ent) => {
                        ent.name = name;
                        return ent;
                    });
            })
            .catch((err) => {
                throw err;
            });
    }

}
