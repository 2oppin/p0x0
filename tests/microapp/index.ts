import * as childProcess from "child_process";
import * as fs from "fs";
import {chai} from "../test.commons"; chai.should();
import {p0x0gen} from "p0x0gen/p0x0gen";

const baseDir = __dirname + "/..";
const ENV_DIR = "docker";
const CODE_DIR = "app/src";

let gen: p0x0gen;
describe("Prototype \"Microapp\" generation tests", () => {
    it("Ensure generator(/tests/microapp.json) was built; All Environment files created", (done) => {
        gen = new p0x0gen(`${baseDir}/microapp.json`);
        gen.run()
            .then((ok) => {
                ok.should.equal(true);
                const baseEnvPath = `${baseDir}/${gen.output}/`;
                [
                    `${ENV_DIR}/docker-compose.yml`,
                    `${ENV_DIR}/gradle/scripts/android-gradle-wrapper.sh`,
                    `${ENV_DIR}/gradle/scripts/hang-container.sh`,
                    `${ENV_DIR}/gradle/Dockerfile`,
                ].map((fileName) => {
                    const fileExists = fs.existsSync(`${baseEnvPath}/${fileName}`);
                    fileExists.should.eq(true, `"${fileName}" was not generated`);
                });
            })
            .then(() => {
                const baseAppPath = `${baseDir}/${gen.output}/`;
                [
                    `${CODE_DIR}/AndroidManifest.xml`,
                    `${CODE_DIR}/Vertex.sqlite`,
                    // Resources
                    `${CODE_DIR}/main/res/mipmap-mdpi/ic_launcher.png`,
                    // Code
                    `${CODE_DIR}/main/java/com/oppin/microapp/AndroidOpenGLMainActivity.java`,
                ].map((fileName) => {
                    const fileExists = fs.existsSync(`${baseAppPath}/${fileName}`);
                    fileExists.should.eq(true, `"${fileName}" was not generated`);
                });
            })
            .then(() => done())
            .catch((err) => done(err || "That's definitely an error"));
    });
    after(async () => {
        if (!gen) return;

        childProcess.exec(`rm -rf ${baseDir}/${gen.output}/${ENV_DIR}`);
        childProcess.exec(`rm -rf ${baseDir}/${gen.output}/${CODE_DIR}`);
    });
});
