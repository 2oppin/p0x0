import {p0x0fileSource} from "p0x0res/sources/files/file.source";
import {chai} from "../../test.commons"; chai.should();
import {p0x0} from "p0x0/p0x0";
import {rdf} from "p0x0res/formats/rdf";
import {p0x0rdfSourceRecordStatement} from "p0x0res/sources/files/rdf/ip0x0rdfSourceRecordStatement";
import {p0x0rdfSourceRecord} from "p0x0res/sources/files/rdf/p0x0rdfSourceRecord";

const testP0x0 = "Thing";

describe("RDF converter check", () => {
    it(`read (${testP0x0}.rdf) read`, async () => {
        const rdfReader = new p0x0fileSource({type: "rdf", dir: __dirname + "/../../entities"}, new rdf());
        const obj: p0x0rdfSourceRecord|p0x0 = await rdfReader.load(testP0x0);
        let doc: p0x0rdfSourceRecord;

        (!!obj).should.be.equal(true);
        (obj instanceof p0x0rdfSourceRecord).should.equal(true);

        doc = obj as p0x0rdfSourceRecord;
        const classSt = doc.statements.find((st: p0x0rdfSourceRecordStatement) =>
            st.object.value === "http://www.w3.org/2000/01/rdf-schema#Class");

        (!!classSt).should.be.equal(true);

        classSt.subject.value.should.be.equal("http://schema.org/Thing");
    });
});
