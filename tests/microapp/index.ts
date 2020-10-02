import * as childProcess from "child_process";
import * as fs from "fs";
import {chai} from "../test.commons"; chai.should();
import {p0x0gen} from "p0x0gen/p0x0gen";

const baseDir = __dirname + "/../";

let gen: p0x0gen;
describe("Prototype \"Microapp\" generation tests", () => {
    it("generator(/tests/microapp.json) generation", (done) => {
        gen = new p0x0gen(baseDir + "microapp.json");
        gen.run()
            .then((ok) => ok.should.equal(true))
            .then(() => done())
            .catch((err) => done(err || "That's definitely an error"));
    });

    const entNames = ["Vertex"];
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
    after(() =>
        gen && fs.readdirSync(baseDir + gen.output)
            .filter((f) => f.match(new RegExp(`^(${entNames.join("|")})\.(.*?)$`)))
            .forEach((f) => {
                fs.unlinkSync(`${baseDir}${gen.output}/${f}`);
                fs.unlinkSync(`${baseDir}${gen.output}/docker`);
            }),
    );
});
