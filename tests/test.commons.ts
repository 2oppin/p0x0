import * as _mocha from 'mocha';
import * as _chai from "chai";
import * as chaiPromised from "chai-as-promised";
var chaiHttp = require("chai-http");

_chai.use(chaiPromised);
_chai.use(chaiHttp);

export var mocha = _mocha;
export var chai = _chai;
export var assert = _chai.assert;
export var expect = _chai.expect;
export var should = _chai.should();

export class Storage {
    private static _vars:any = {};
    public static get(key: string):any {
        return Storage._vars[key];
    };
    public static set(key: string, val:any):any {
        Storage._vars[key] = val;
    };
}