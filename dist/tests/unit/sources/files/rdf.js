"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_commons_1 = require("../../../test.commons");
test_commons_1.chai.should();
const rdf_1 = require("../../../../p0x0res/source/sources/files/rdf");
const p0x0rdfSourceRecord_1 = require("../../../../p0x0res/source/sources/files/p0x0/p0x0rdfSourceRecord");
const testP0x0 = 'Thing';
describe('RDF converter check', () => {
    it('read (' + testP0x0 + '.rdf) read', () => __awaiter(this, void 0, void 0, function* () {
        let rdfReader = new rdf_1.rdf({ name: "rdf", dir: __dirname });
        let obj = yield rdfReader.load(testP0x0), doc;
        (!!obj).should.be.equal(true);
        (obj instanceof p0x0rdfSourceRecord_1.p0x0rdfSourceRecord).should.equal(true);
        doc = obj;
        let classSt = doc.statements.find((st) => st.object.value == 'http://www.w3.org/2000/01/rdf-schema#Class');
        (!!classSt).should.be.equal(true);
        classSt.subject.value.should.be.equal('http://schema.org/Thing');
    }));
});
//# sourceMappingURL=rdf.js.map