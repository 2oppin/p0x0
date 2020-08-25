import {createServer, Server, ServerResponse} from "http";
import {sourceFactory} from "p0x0res";
import {ip0x0genResourceConfig, p0x0source} from "../p0x0res/source";

export class p0x0Srv {
    private srv: Server;
    private source: p0x0source;
    constructor(protected port: number = 8888, protected config: ip0x0genResourceConfig = null) {
        if (!this.config) {
            this.config = {type: "json"};
        }
        this.source = sourceFactory(this.config);
        this.srv = createServer((req, res: ServerResponse) => {
            const entName = req.url.match(/(.*)?\/([^\/]+)\/?/)[2];
            this.source.load(entName, true)
                .then((body) => {
                    res.writeHead(200);
                    res.end(body);
                })
                .catch((e: Error) => {
                    res.writeHead(500);
                    res.end(e.message);
                });
        });
        this.srv.listen(port);
    }

    public getUri() {
        return `http://localhost:${this.port}/`;
    }

    public close(): Promise<any> {
        return new Promise<any>((r, rj) => {
            this.srv.once("close", r);
            this.srv.close(rj);
        });
    }
}
