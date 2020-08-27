"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const p0x0_1 = require("p0x0/p0x0");
const p0x0res_1 = require("p0x0res");
const p0x0helper_1 = require("../p0x0helper/p0x0helper");
const config_1 = require("./config/config");
const generators = require("./generator");
class p0x0gen extends p0x0_1.p0x0 {
    constructor(fileName) {
        super();
        this.generators = [];
        this.sources = [];
        this.configFile = fileName;
    }
    get output() {
        return this.config.output;
    }
    run() {
        return this._loadConfig()
            .then(() => this.loadAll())
            .then((objs) => Promise.all(objs.map((obj) => this.generate(obj))))
            .then((results) => !results.find((res) => !res))
            .catch((e) => {
            throw new Error(e);
        });
    }
    generate(obj) {
        return Promise.all(this.generators.map((g) => g.generate(obj)))
            .then((res) => !res.find((r) => r !== true));
    }
    loadAll() {
        const loadedEnts = {};
        return Promise.all(this.config.prototypes.map((p0x0Name) => this.load(p0x0Name)
            .then((ent) => loadedEnts[p0x0Name] = ent)
            .catch((err) => {
            throw new Error(err);
        }))).then((ents) => {
            ents = ents.map((ent) => {
                const baseName = typeof ent.base === "string" ? ent.base : "";
                if (baseName)
                    ent.base = loadedEnts[baseName] || baseName;
                return ent;
            });
            return ents;
        });
    }
    load(p0x0Name) {
        const _srcStack = this.sources.slice(0);
        const processedSrcNames = [];
        return new Promise((resolve, reject) => {
            const search = () => {
                if (!_srcStack.length) {
                    return Promise.reject(`${p0x0Name} not found in sources: ${Object.keys(processedSrcNames).join()}`);
                }
                const srcT = _srcStack.pop();
                return srcT
                    .load(p0x0Name, false)
                    .catch((err) => {
                    processedSrcNames.push(srcT.type);
                    return _srcStack.length
                        ? search()
                        : Promise.reject(err);
                });
            };
            return search()
                .then(resolve)
                .catch((err) => reject(err));
        });
    }
    _loadConfig() {
        return new Promise((resolve, reject) => fs.readFile(this.configFile, (err, data) => {
            if (err)
                return reject(err);
            return resolve(p0x0helper_1.p0x0helper.fill(new config_1.p0x0genConfig(), JSON.parse(data.toString())));
        }))
            .then((conf) => {
            this.config = conf;
            if (!this.config.validate()) {
                this.config = null;
                throw new Error("Invalid config.");
            }
            const cnfDir = this.configFile.slice(0, this.configFile.lastIndexOf("/") + 1);
            this.generators = this.config.generators.map((src) => {
                let cnf = null, lang;
                if (typeof src === "string") {
                    lang = src;
                }
                else {
                    lang = src.lang;
                    cnf = src;
                }
                if (!generators[lang])
                    throw new Error(`Invalid config: unknown generator ${lang}.`);
                return (new generators[lang](cnfDir + this.config.output, cnf || { lang }));
            });
            for (const src of this.config.sources) {
                this.sources.push(p0x0res_1.sourceFactory(src));
            }
            return this.config;
        });
    }
}
exports.p0x0gen = p0x0gen;
//# sourceMappingURL=p0x0gen.js.map