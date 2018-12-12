"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * generator Data (usually DB, but can be rest or any other storage)
 */
var p0x0_1 = require("../p0x0/p0x0");
var p0x0d = /** @class */ (function (_super) {
    __extends(p0x0d, _super);
    function p0x0d(_provider) {
        var _this = _super.call(this) || this;
        _this._provider = _provider;
        _this.create = function (obj) { return _this._provider.create(obj); };
        _this.update = function (id, obj) { return _this._provider.update(id, obj); };
        _this.get = function (id) { return _this._provider.get(id); };
        _this.search = function (cond) { return _this._provider.search(cond); };
        return _this;
    }
    return p0x0d;
}(p0x0_1.p0x0));
exports.p0x0d = p0x0d;
