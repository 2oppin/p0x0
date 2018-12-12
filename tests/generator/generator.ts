import * as childProcess from 'child_process';
import * as fs from 'fs';
import {chai, expect} from "../test.commons"; chai.should();
import {p0x0} from "../../src/p0x0/p0x0";
import {p0x0gen} from "../../src/p0x0gen/p0x0gen";

class Dub extends p0x0 {
    // Note! for TS properties should be initialized otherwise they're 'not exists'
    a: string = null;
    b: string = null;
}
const baseDir = __dirname + '/../';
let gen: p0x0gen;
describe('Generation generator tests (Thing)', () => {
    it('generator(Thing) generation', (done) => {
        gen = new p0x0gen(baseDir + 'p0x0.thing.json');
        gen.run()
            .then(ok => {
                ok.should.equal(true);
            })
            .then(done)
            .catch(err => {
                err = err || "That's definitely error";
                err.should.equal(null)
            });
    });
    it('check (Thing) exists', (done) => {
        let fileName: string = baseDir + gen.config.output + '/Thing.ts',
            fileExists:boolean = false;
        fileExists = fs.existsSync(fileName);
        fileExists.should.eq(true);
        childProcess.exec('tsc ' + fileName, (err, stdout, strerr) => {
            expect(err).be.empty;
            console.log("RES: ", stdout);
            fileExists = fs.existsSync(baseDir + gen.config.output + '/Thing.js');
            fileExists.should.eq(true, "Thing.ts was not compiled.");
            done();
        });
    });
});