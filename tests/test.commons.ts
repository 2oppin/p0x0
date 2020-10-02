import * as _chai from "chai";
import * as chaiPromised from "chai-as-promised";
import * as _mocha from "mocha";

// tslint:disable-next-line:no-var-requires
const chaiHttp = require("chai-http");

_chai.use(chaiPromised);
_chai.use(chaiHttp);

export const mocha = _mocha;
export const chai = _chai;
export const assert = _chai.assert;
export const expect = _chai.expect;
export const should = _chai.should();

export class Storage {
    public static get(key: string): any {
        return Storage._vars[key];
    }
    public static set(key: string, val: any): any {
        Storage._vars[key] = val;
    }
    private static _vars: any = {};
}
