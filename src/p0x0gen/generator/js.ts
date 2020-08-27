import {Entity, IEntityField} from "../../p0x0/entity";
import {ip0x0genGeneratorConfig, p0x0generator} from "./generator";

export interface ip0x0genTsConfig extends ip0x0genGeneratorConfig {
    imports?: string[];
    baseClass?: string;
}

export class js extends p0x0generator {
    constructor(protected _output: string = "./", protected _config: ip0x0genTsConfig = {lang: "ts"}) {
        super();
    }

    public prepare(obj: Entity): string {
        let imports = this._config.imports
                ?   `var GImports_1 = require("./imports)");\n`
                    + this._config.imports.map((u) => `var ${u}_1 = GImports_1.${u};`).join("\n")
                    + "\n"
                : "";
        const using = (obj.using || []),
            base: string = (obj.base && obj.base.name) || this._config.baseClass || null,
            extend = base ? `${base}_1.${base}` : "";
        if (using.length) {
            imports += using.map((u) => `var ${u}_1 = require("./${u}");`).join("\n") + "\n";
        }
        const fields: {[name: string]: IEntityField|string|any} = obj.fields,
            fieldsNames = Object.getOwnPropertyNames(fields);
        let res =
`
"use strict";
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
`
+
imports
+
`
/**
 * Class ${obj.name}
 */
var ${obj.name} = /** @class */ (function (_super) {
    __extends(${obj.name}, _super);
    function ${obj.name}() {
        var _this = _super !== null && _super.apply(this, arguments) || this;`;

        for (const p of fieldsNames) {
            const v = JSON.stringify((fields[p] && fields[p].default) || null);
            res += `        _this.${p} = ${v};\n`;
        }
        res += `
        return _this;
    }
    return ${obj.name};
}(${extend}));
exports.${obj.name} = ${obj.name};
`;
        return res;
    }
}
