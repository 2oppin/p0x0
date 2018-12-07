import {chai} from "../test.commons"; chai.should();
import {p0x0} from "../../p0x0/p0x0";
import {p0x0gen} from "../../p0x0gen/p0x0gen";

class Dub extends p0x0 {
    // Note! for TS properties should be initialized otherwise they're 'not exists'
    a: string = null;
    b: string = null;
}
describe('Generation p0x0 tests', () => {
    it('p0x0 generation!', () => {
        let gen = new p0x0gen();
        gen.run();
    });
});