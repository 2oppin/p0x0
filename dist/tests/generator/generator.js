"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const childProcess = require("child_process");
const fs = require("fs");
const test_commons_1 = require("../test.commons");
test_commons_1.chai.should();
const p0x0_1 = require("../../p0x0/p0x0");
const p0x0gen_1 = require("../../p0x0gen/p0x0gen");
class Dub extends p0x0_1.p0x0 {
    constructor() {
        super(...arguments);
        // Note! for TS properties should be initialized otherwise they're 'not exists'
        this.a = null;
        this.b = null;
    }
}
const baseDir = __dirname + '/../';
let gen;
describe('Generation generator tests (Thing)', () => {
    it('generator(Thing) generation', (done) => {
        gen = new p0x0gen_1.p0x0gen(baseDir + 'p0x0.thing.json');
        gen.run()
            .then(ok => {
            ok.should.equal(true);
        })
            .then(done)
            .catch(err => {
            err = err || "That's definitely an error";
            err.should.equal(null);
        });
    });
    for (const entName of ["Thing", "JsonThing", "Event"]) {
        it(`check (${entName}) exists`, (done) => {
            let fileName = baseDir + gen.config.output + `/${entName}.ts`, fileExists = false;
            fileExists = fs.existsSync(fileName);
            fileExists.should.eq(true);
            childProcess.exec('tsc ' + fileName, (err, stdout, strerr) => {
                test_commons_1.expect(err || "").be.empty;
                fileExists = fs.existsSync(baseDir + gen.config.output + `/${entName}.js`);
                fileExists.should.eq(true, `${entName}.ts has not been compiled.`);
                done();
            });
        }).timeout(10000);
    }
});
//# sourceMappingURL=generator.js.map