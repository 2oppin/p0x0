import {chai} from "../test.commons"; chai.should();
import {p0x0} from "../../src/p0x0/p0x0";

class Dub extends p0x0 {
    // Note! for TS properties should be initialized otherwise they're 'not exists'
    a: string = null;
    b: string = null;
}
describe('basic generator tests', () => {
    it('generator!', () => {
        let d = new Dub,
            b = d instanceof p0x0,
            reqProps = ['a', 'b'],
            props = Object.getOwnPropertyNames(d);
        b.should.equal(true, 'Dub is not generator :(');

        for (let p of reqProps)
            props.includes(p).should.equal(true, p + ' absent in Dub :(');
        for (let p of props)
            reqProps.includes(p).should.equal(true, p + ' should not be a property of Dub, it\'s not ur generator');
    });
});