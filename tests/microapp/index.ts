import * as childProcess from "child_process";
import * as fs from "fs";
import {chai} from "../test.commons"; chai.should();
import {p0x0gen} from "p0x0gen/p0x0gen";

const baseDir = __dirname + "/..";

let gen: p0x0gen;
describe("Prototype \"Microapp\" generation tests", () => {
    it("Ensure generator(/tests/microapp.json) was built; All Environment files created", (done) => {
        gen = new p0x0gen(`${baseDir}/microapp.json`);
        gen.run()
            .then((ok) => {
                ok.should.equal(true);
                const baseEnvPath = `${baseDir}/${gen.output}/`;
                [
                    "../docker/docker-compose.yml",
                    "../docker/gradle/scripts/android-gradle-wrapper.sh",
                    "../docker/gradle/scripts/hang-container.sh",
                    "../docker/gradle/Dockerfile",
                ].map((fileName) => {
                    const fileExists = fs.existsSync(`${baseEnvPath}/${fileName}`);
                    fileExists.should.eq(true);
                });
            })
            .then(() => done())
            .catch((err) => done(err || "That's definitely an error"));
    });

    const entNames = ["Vertex"];
    for (const entName of entNames) {
        it(`check (${entName}) exists and has valid TS file`, (done) => {
            const basePath = `${baseDir}/${gen.output}`;
            const fileName: string = `${basePath}/${entName}.ts`;
            let fileExists: boolean = false;
            fileExists = fs.existsSync(fileName);
            fileExists.should.eq(true);
            childProcess.exec("tsc " + fileName, (err, stdout, strerr) => {
                if (err) done(err);

                fileExists = fs.existsSync(`${basePath}/${entName}.js`);
                fileExists.should.eq(true, `${entName}.ts has not been compiled.`);
                done();
            });
        }).timeout(10000);
    }
    after(async () => {
        if (!gen) return;

        childProcess.exec(`rm -rf ${baseDir}/${gen.output}/../docker`);
        childProcess.exec(`rm -rf ${baseDir}/${gen.output}`);
    });
});
