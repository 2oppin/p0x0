import {Entity} from "p0x0/entity";
import {p0x0Function} from "p0x0/p0x0Function";
import {p0x0generator} from "./generator";

// copy-paste from TS output
export class js extends p0x0generator {
    public async prepare(obj: Entity): Promise<string> {
        const {base, name} = obj;

        return `"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.${name} = void 0;
${base ? `var imports_1 = require("./imports");` : ""}
var ${name} = /** @class */ (function (_super) {
    __extends(${name}, _super);
    function ${name}() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ${name};
}(${base ? `imports_1.Model` : "{}"}));
exports.${name} = ${name};`;
    }

    protected async prepareMethods(obj: Entity): Promise<string> {
        return (await Promise.all(Object.entries(obj.fields)
            .map(async ([name, value]): Promise<string> => {
            const [, , , funcArgs, , , , dfault] =
                Entity.getTypeFromString(value);
            if (!funcArgs) return "";
            return dfault
                ? this.loadFncValue(dfault)
                : `    this.${name} = () => {\n        //  TODO\n    }`;
        }))).join("\n");
    }

    protected async loadFncValue(dfault): Promise<string> {
        const fnc: p0x0Function = await this.sources.loadInstance("p0x0Function", {ID: dfault});
        const args = Object.entries(fnc.arguments)
            .map(([name, varType]) => `${varType} ${name}`).join(", ");
        const body = fnc.body.split("\n").map((row) => `        ${row}`).join("\n");
        return `    ${fnc.name}(${args}) {\n${body}\n    }`;
    }
}
