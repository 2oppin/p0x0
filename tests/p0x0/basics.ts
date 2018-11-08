import {chai, assert} from "../test.commons"
import {p0x0} from "../../p0x0/p0x0";

class Dub extends p0x0 {

}
describe('basic p0x0 tests', () => {
    it('p0x0!', () => {
        let d = new Dub,
            b = d instanceof p0x0;
        b.should.equal(true, 'Dub is not p0x0 :(');
    });
});