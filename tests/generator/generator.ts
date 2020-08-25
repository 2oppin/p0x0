import * as childProcess from "child_process";
import * as fs from "fs";
import {chai, expect} from "../test.commons"; chai.should();
import {p0x0} from "p0x0/p0x0";
import {p0x0gen} from "p0x0gen/p0x0gen";

class Dub extends p0x0 {
    // Note! for TS properties should be initialized otherwise they're 'not exists'
    public a: string = null;
    public b: string = null;
}
const baseDir = __dirname + "/../";

let gen: p0x0gen;
describe("Generation generator tests (Thing)", () => {
    it("generator(/tests/p0x0.thing.json) generation", (done) => {
        gen = new p0x0gen(baseDir + "p0x0.thing.json");
        gen.run()
            .then((ok) => {
                ok.should.equal(true);
            })
            .then(done)
            .catch((err) => done(err || "That's definitely an error"));
    });

    const entNames = ["Thing", "JsonThing", "CoolJsonThing"];
    for (const entName of entNames) {
        it(`check (${entName}) exists and has valid TS file`, (done) => {
            const fileName: string = baseDir + gen.config.output + `/${entName}.ts`;
            let fileExists: boolean = false;
            fileExists = fs.existsSync(fileName);
            fileExists.should.eq(true);
            childProcess.exec("tsc " + fileName, (err, stdout, strerr) => {
                if (err) done(err);

                fileExists = fs.existsSync(baseDir + gen.config.output + `/${entName}.js`);
                fileExists.should.eq(true, `${entName}.ts has not been compiled.`);
                done();
            });
        }).timeout(10000);
    }
    after(() => {
        fs.readdirSync(baseDir + gen.config.output)
            .filter((f) => f.match(new RegExp(`^(${entNames.join("|")})\.(.*?)$`)))
            .forEach((f) =>
                fs.unlinkSync(`${baseDir}${gen.config.output}/${f}`),
            );
    });
});
