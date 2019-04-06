"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_commons_1 = require("../test.commons");
test_commons_1.chai.should();
const p0x0_1 = require("../../p0x0/p0x0");
class Dub extends p0x0_1.p0x0 {
    constructor() {
        super(...arguments);
        // Note! for TS properties should be initialized otherwise they're 'not exists'
        this.a = null;
        this.b = null;
    }
}
describe('basic generator tests', () => {
    it('generator!', () => {
        let d = new Dub, b = d instanceof p0x0_1.p0x0, reqProps = ['a', 'b'], props = Object.getOwnPropertyNames(d);
        b.should.equal(true, 'Dub is not generator :(');
        for (let p of reqProps)
            props.includes(p).should.equal(true, p + ' absent in Dub :(');
        for (let p of props)
            reqProps.includes(p).should.equal(true, p + ' should not be a property of Dub, it\'s not ur generator');
    });
});
//# sourceMappingURL=basics.js.map