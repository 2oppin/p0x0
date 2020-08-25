import {createServer, ServerResponse, Server} from "http";

export interface IExpectedResponse {
    code: number;
    body: string;
}

export class SimpleSrv {
    private srv: Server
    private expectedResp: IExpectedResponse;
    constructor(private port: number = 8888){
        this.srv = createServer((req, res: ServerResponse) => {
            res.writeHead(this.expectedResp.code);
            res.end(this.expectedResp.body);
        });
        this.srv.listen(port);
    }

    public getUri() {
        return `http://localhost:${this.port}/`
    }

    public expect(expectedResp: IExpectedResponse) {
        this.expectedResp = expectedResp;
    }

    public close(): Promise<any> {
        return new Promise<any>((r, rj) => {
            this.srv.once('close', r);
            this.srv.close(rj);
        });
    }
}
