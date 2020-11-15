import * as fs from "fs";
import {chai} from "../test.commons"; chai.should();
import {p0x0gen} from "p0x0gen/p0x0gen";

const baseDir = __dirname + "/..";
const ENV_DIR = "docker";
const APP_DIR = "app";
const CODE_DIR = `${APP_DIR}/app/src`;
const CODE_JAVA_DIR = `${CODE_DIR}/main/java/com/oppin/microapp`;
const CODE_RES_DIR = `${CODE_DIR}/main/res`;

const ENV_FILES = [
    `makefile`,
    `${ENV_DIR}/docker-compose.yml`,
    `${ENV_DIR}/gradle/scripts/android-gradle-wrapper.sh`,
    `${ENV_DIR}/gradle/scripts/hang-container.sh`,
    `${ENV_DIR}/gradle/Dockerfile`,
    // BUILD
    `${APP_DIR}/build.gradle`,
    `${APP_DIR}/settings.gradle`,
    `${APP_DIR}/gradle.properties`,
    `${APP_DIR}/app/build.gradle`,
];
const APP_FILES = [
    `${CODE_DIR}/main/AndroidManifest.xml`,
    // Resources
    `${CODE_RES_DIR}/layout/activity_main.xml`,
    `${CODE_RES_DIR}/mipmap-anydpi-v26/ic_launcher.xml`,
    `${CODE_RES_DIR}/mipmap-anydpi-v26/ic_launcher_round.xml`,
    `${CODE_RES_DIR}/mipmap-mdpi/ic_launcher.png`,
    `${CODE_RES_DIR}/mipmap-mdpi/ic_launcher_background.png`,
    `${CODE_RES_DIR}/mipmap-mdpi/ic_launcher_foreground.png`,
    `${CODE_RES_DIR}/mipmap-mdpi/ic_launcher_round.png`,
    `${CODE_RES_DIR}/values/colors.xml`,
    `${CODE_RES_DIR}/values/strings.xml`,
    // Code
    `${CODE_JAVA_DIR}/MainActivity.java`,
    `${CODE_JAVA_DIR}/MicroappRenderer.java`,
    `${CODE_JAVA_DIR}/shapes/Triangle.java`,
    `${CODE_JAVA_DIR}/view/MicroappSurfaceView.java`,
];
const GENERATED_FILES = [];
let gen: p0x0gen;
describe("Prototype \"Microapp\" generation tests", () => {
    it("Ensure generator(/tests/microapp.json) was built; All Environment files created", (done) => {
        gen = new p0x0gen(`${baseDir}/microapp.json`);
        gen.run()
            .then((ok) => {
                ok.should.equal(true);
                const baseEnvPath = `${baseDir}/${gen.output}/`;
                ENV_FILES.map((fileName) => {
                    const fileExists = fs.existsSync(`${baseEnvPath}/${fileName}`);
                    fileExists.should.eq(true, `"${fileName}" was not generated`);
                    GENERATED_FILES.push(`${baseEnvPath}/${fileName}`);
                });
            })
            .then(() => {
                const baseAppPath = `${baseDir}/${gen.output}/`;
                const missedFiles: string[] = [];
                APP_FILES.map((fileName) => {
                    if (!fs.existsSync(`${baseAppPath}/${fileName}`)) {
                        missedFiles.push(fileName);
                    } else {
                        GENERATED_FILES.push(`${baseAppPath}/${fileName}`);
                    }
                });
                missedFiles.length.should.eq(
                    0,
                    missedFiles.map(fileName => `"${fileName}" was not generated`).join("\n")
                );
            })
            .then(() => done())
            .catch((err) => done(err || "That's definitely an error"));
    });
    after(async () => {
        if (!gen) return;

        Promise.all(
            // This line exists only because of "makefile" residing in the root of the generation output
            GENERATED_FILES.map((fname) => fs.promises.unlink(fname))
        ).then(() => Promise.all([
            fs.promises.rmdir(`${baseDir}/${gen.output}/${ENV_DIR}`, {recursive: true}),
            fs.promises.rmdir(`${baseDir}/${gen.output}/${APP_DIR}`, {recursive: true}),
        ]));
    });
});
