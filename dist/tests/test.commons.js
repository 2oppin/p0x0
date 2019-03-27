"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _mocha = require("mocha");
const _chai = require("chai");
const chaiPromised = require("chai-as-promised");
var chaiHttp = require("chai-http");
_chai.use(chaiPromised);
_chai.use(chaiHttp);
exports.mocha = _mocha;
exports.chai = _chai;
exports.assert = _chai.assert;
exports.expect = _chai.expect;
exports.should = _chai.should();
class Storage {
    static get(key) {
        return Storage._vars[key];
    }
    ;
    static set(key, val) {
        Storage._vars[key] = val;
    }
    ;
}
Storage._vars = {};
exports.Storage = Storage;
//# sourceMappingURL=test.commons.js.map