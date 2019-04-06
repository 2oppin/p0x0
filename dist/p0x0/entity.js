"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
class Entity extends model_1.Model {
    constructor() {
        super(...arguments);
        this.name = "";
        this.base = null;
        this.using = [];
    }
}
exports.Entity = Entity;
//# sourceMappingURL=entity.js.map