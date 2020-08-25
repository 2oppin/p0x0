import * as http from "http";
import {Entity} from "p0x0/entity";
import {p0x0convertor} from "../../convertor";
import {ip0x0genResourceConfig, p0x0source} from "../../source";

export interface ip0x0remoteSourceConfig extends ip0x0genResourceConfig {
    url: string;
}

export class p0x0remoteSource extends p0x0source {
    protected _dir;

    get type() { return this.convertor.type; }
    get dir() { return this._dir; }
    get ext() {
        return this.convertor.type;
    }

    constructor(protected config: ip0x0remoteSourceConfig, protected convertor: p0x0convertor = null) {
        super(config, convertor);
    }

    public load(name: string, raw: boolean = false): Promise<Entity|string> {
        return new Promise((resolve, reject) =>
            http.get(`${this.config.url}/${name}`, (res) => {
                if (res.statusCode < 200 || res.statusCode >= 400) reject(res.statusCode);
                let body = "";
                res.on("data", (data) => body += data);
                res.on("end", () => {
                    resolve(raw ? body : this.convertor.convert(body));
                });
            }),
        );
    }
}
