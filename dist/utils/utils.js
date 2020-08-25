"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static deepCopy(obj) {
        let copy;
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" !== typeof obj)
            return obj;
        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = Utils.deepCopy(obj[i]);
            }
            return copy;
        }
        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (const attr in obj) {
                if (obj.hasOwnProperty(attr))
                    copy[attr] = Utils.deepCopy(obj[attr]);
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    }
}
exports.Utils = Utils;
Utils.randomColor = (base = 0) => "rgb(" + ["", "", ""].map(() => base + Math.round(Math.random() * (255 - base))).join() + ")";
Utils.capitaize = (s) => s[0].toUpperCase() + s.slice(1);
Utils.e = (_enum, val) => Number.isNaN(+val) ? _enum[_enum[val]] : _enum[val];
Utils.el = (_enum) => Object.getOwnPropertyNames(_enum).filter((v) => Number.isNaN(+v));
Utils.en = (_enum, val) => Number.isNaN(+val) ? _enum[val] : _enum[_enum[val]];
Utils.enl = (_enum) => Object.getOwnPropertyNames(_enum).map((v) => _enum[v]).filter((v) => !Number.isNaN(+v));
Utils.floor = (val, prc) => (Math.floor(val * (10 ** prc)) / (10 ** prc));
Utils.sum = (_arr) => _arr.length ? _arr.slice(0).reduce((a, b) => a + b, 0) : 0;
Utils.sumo = (_arr, prop) => Utils.sum(_arr.map((a) => a[prop]));
Utils.avg = (_arr) => _arr.length ? Utils.sum(_arr) / _arr.length : 0;
Utils.avgo = (_arr, prop) => _arr.length ? Utils.sumo(_arr, prop) / _arr.length : 0;
Utils.bigX = (_arr, x) => _arr.slice(0).sort((a, b) => b - a).slice(0, x);
Utils.big3 = (_arr) => Utils.bigX(_arr, 3);
Utils.big3o = (_arr, prop) => _arr.slice(0).sort((a, b) => b[prop] - a[prop]).slice(0, 3);
// @ts-ignore
Utils.dstr = (n) => [...new Array(n)]
    .reduce((a, _, i) => a[1].push(-a[0] + (a[0] += (1 - a[0]) * (n - i < 2 ? 1 : Math.random()))) && a, [0, []])[1];
Utils.diffMonths = (d1, d2) => d2.getFullYear() * 12 + d2.getMonth() - d1.getFullYear() * 12 - d1.getMonth();
//# sourceMappingURL=utils.js.map