import {chai} from "../../../test.commons"; chai.should();
import {rdf} from "p0x0res/source/sources/files/rdf";
import {p0x0rdfSourceRecord} from "p0x0res/source/sources/files/p0x0/p0x0rdfSourceRecord";
import {p0x0} from "p0x0/p0x0";
import {p0x0rdfSourceRecordStatement} from "p0x0res/source/sources/files/p0x0/ip0x0rdfSourceRecordStatement";

const testP0x0 = 'Thing';

describe('RDF converter check', () => {
    it('read (' + testP0x0 + '.rdf) read', async () => {
        let rdfReader = new rdf({name: "rdf", dir: __dirname + '/../../../entities'});
        let obj: p0x0rdfSourceRecord|p0x0 = await rdfReader.load(testP0x0),
            doc: p0x0rdfSourceRecord;

        (!!obj).should.be.equal(true);
        (obj instanceof p0x0rdfSourceRecord).should.equal(true);

        doc = <p0x0rdfSourceRecord>obj;
        let classSt = doc.statements.find((st:p0x0rdfSourceRecordStatement) =>
            st.object.value == 'http://www.w3.org/2000/01/rdf-schema#Class');

        (!!classSt).should.be.equal(true);

        classSt.subject.value.should.be.equal('http://schema.org/Thing');
    });
});
