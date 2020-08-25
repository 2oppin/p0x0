"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const p0x0_1 = require("p0x0/p0x0");
const p0x0helper_1 = require("../p0x0helper/p0x0helper");
const config_1 = require("./config/config");
const generators = require("./generator");
const source_1 = require("p0x0res/source");
class p0x0gen extends p0x0_1.p0x0 {
    constructor(fileName = "p0x0.json") {
        super();
        this._generators = [];
        this._sources = [];
        this._configFile = fileName;
    }
    get configFile() {
        return this._configFile;
    }
    ;
    get config() {
        return this._config;
    }
    ;
    run() {
        return this._loadConfig()
            .then((conf) => this.loadAll())
            .then((objs) => Promise.all(objs.map((obj) => this.generate(obj))))
            .then(results => !results.find(res => !res))
            .catch((e) => {
            throw new Error(e);
        });
    }
    generate(obj) {
        return Promise.all(this._generators.map(g => g.generate(obj)))
            .then((res) => !res.find(res => res !== true));
    }
    loadAll() {
        let loadedEnts = {};
        return Promise.all(this._config.prototypes.map((p0x0Name) => this.load(p0x0Name)
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
        let _srcStack = this._sources.slice(0), processedSrcNames = [];
        return new Promise((resolve, reject) => {
            let search = () => {
                if (!_srcStack.length)
                    return Promise.reject(p0x0Name + " not found in sources: " + processedSrcNames.join());
                let srcT = _srcStack.pop();
                return srcT
                    .load(p0x0Name)
                    .then((ent) => processedSrcNames[srcT.name] = ent)
                    .catch(err => {
                    processedSrcNames.push(srcT.name);
                    return _srcStack.length
                        ? search()
                        : Promise.reject(err);
                });
            };
            return search()
                .then(resolve)
                .catch(err => reject(err));
        });
    }
    _loadConfig() {
        return new Promise((resolve, reject) => fs.readFile(this._configFile, (err, data) => {
            if (err)
                return reject(err);
            return resolve(p0x0helper_1.p0x0helper.fill(new config_1.p0x0genConfig(), JSON.parse(data.toString())));
        }))
            .then((conf) => {
            this._config = conf;
            if (!this._config.validate()) {
                this._config = null;
                throw new Error("Invalid config.");
            }
            let cnfDir = this.configFile.slice(0, this.configFile.lastIndexOf("/") + 1);
            this._generators = this._config.generators.map((src) => {
                let cnf = null, lang;
                if (typeof src === "string")
                    lang = src;
                else {
                    lang = src.lang;
                    cnf = src;
                }
                if (!generators[lang])
                    throw new Error(`Invalid config: unknown generator ${lang}.`);
                return (new generators[lang](cnfDir + this._config.output, cnf || { lang }));
            });
            for (let src of this._config.sources) {
                let cnf = null, nm;
                if (typeof src === "string")
                    nm = src;
                else {
                    nm = src.name;
                    cnf = src;
                }
                if (source_1.sourceTypes[nm])
                    this._sources.push(new source_1.sourceTypes[nm](cnf));
            }
            return this._config;
        });
    }
}
exports.p0x0gen = p0x0gen;
//# sourceMappingURL=p0x0gen.js.map