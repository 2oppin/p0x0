import * as http from "http";
import {chai, expect} from "../test.commons"; chai.should();
import {SimpleSrv} from "../utils/single.request.server";

describe("Fetch Remote p0x0Srv", () => {
    it("Stub for future remote source", (done) => {
        const srv = new SimpleSrv();
        const exp = {code: 200, body: "~~~"};
        srv.expect(exp);
        http.get(srv.getUri(), (res) => {
            expect(res.statusCode).eq(exp.code);
            let body = "";
            res.on("data", (data) => body += data);
            res.on("end", () => {
                expect(body).eq(exp.body);
                srv.close()
                    .then(done);
            });
        });
    });
});
