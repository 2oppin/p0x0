import * as childProcess from "child_process";
import * as fs from "fs";
import {p0x0Srv} from "p0x0sv/server";
import {chai} from "../test.commons"; chai.should();
import {p0x0gen} from "p0x0gen/p0x0gen";

let gen: p0x0gen;
let Srv: p0x0Srv = null;
const baseDir = __dirname + "/../";
describe("Fetch Remote p0x0Srv", () => {
    before(() => {
        Srv = new p0x0Srv(8888, {type: "json", dir: baseDir + "entities"});
    });
    it("generator(/tests/p0x0.thing.json) generation", (done) => {
        gen = new p0x0gen(baseDir + "remote.thing.json");
        gen.run()
            .then((ok) => ok.should.equal(true))
            .then(() => done())
            .catch((err) => done(err || "That's definitely an error"));
    });

    const entNames = ["JsonThing", "CoolJsonThing"];
    for (const entName of entNames) {
        it(`check (${entName}) exists and has valid TS file`, (done) => {
            const fileName: string = baseDir + gen.output + `/${entName}.ts`;
            let fileExists: boolean = false;
            fileExists = fs.existsSync(fileName);
            fileExists.should.eq(true);
            childProcess.exec("tsc " + fileName, (err, stdout, strerr) => {
                if (err) done(err);

                fileExists = fs.existsSync(baseDir + gen.output + `/${entName}.js`);
                fileExists.should.eq(true, `${entName}.ts has not been compiled.`);
                done();
            });
        }).timeout(10000);
    }
    after(() => {
        Srv.close();
        fs.readdirSync(baseDir + gen.output)
            .filter((f) => f.match(new RegExp(`^(${entNames.join("|")})\.(.*?)$`)))
            .forEach((f) =>
                fs.unlinkSync(`${baseDir}${gen.output}/${f}`),
            );
    });
});
