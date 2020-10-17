import * as fs from "fs";
import {Package} from "p0x0/package";
import {Platform} from "p0x0/platform";
import {EnvGenerator} from "p0x0gen/generator/env/env.generator";
import {SourcePool} from "p0x0res/sourcePool";
import * as path from "path";

import {Environment} from "p0x0/environment";
import {sourceFactory} from "p0x0res";
import {p0x0source} from "p0x0res/source";
import {Utils} from "utils/utils";
import {p0x0genConfig} from "./config/config";
import * as generators from "./generator";
import {p0x0generator} from "./generator";
import {ip0x0genGeneratorConfig} from "./generator/generator";

export class p0x0gen {
    protected baseAppSourcesPath;
    protected config: p0x0genConfig;
    protected generators: p0x0generator[] = [];
    protected sourcePool: SourcePool;
    // protected sources: p0x0source[] = [];

    constructor(
        protected configFile: string) {}

    get output() {
        return this.config.output;
    }

    public run(): Promise<boolean> {
        return this.loadConfig()
            .then(() => this.prepareEnv())
            .then(() => this.config.code.generate(this.baseAppSourcesPath, this.generators))
            .then(() => true)
            .catch((e) => {
                throw new Error(e);
            });
    }

    protected async prepareEnv(): Promise<Environment|null> {
        if (!this.config.env) return null;

        const envGen = new EnvGenerator(
            this.config.env,
            `${path.dirname(this.configFile)}/${this.config.output}`,
        );
        return await envGen.run();
    }

    protected loadConfig(): Promise<p0x0genConfig> {
        return new Promise<p0x0genConfig>((resolve, reject) =>
            fs.readFile(this.configFile, (err, data: Buffer) => {
                if (err) return reject(err);

                return resolve(new p0x0genConfig(JSON.parse(data.toString())));
            }),
        )
        .then(async (conf: p0x0genConfig) => {
            this.config = conf;
            if (!this.config.validate()) {
                this.config = null;
                throw new Error("Invalid config.");
            }
            this.baseAppSourcesPath = `${path.dirname(this.configFile)}/${this.config.output}`;
            const sources: p0x0source[] = [];
            for (const src of this.config.sources) {
                sources.push(sourceFactory(src));
            }
            this.sourcePool = new SourcePool(sources);
            this.generators = this.config.generators.map((src) =>
                this.addGenerator(src, this.sourcePool),
            );
            if (this.config.env) {
                this.config.env = await this.sourcePool.loadInstance("Environment", this.config.env);
            }
            if (this.config.code) {
                // Allow have strings instead of object
                this.config.code = await this.preparePackageEntities(this.config.code);
                this.config.code = new Package(
                    await this.sourcePool.loadInstance("Package", this.config.code),
                );
            }
            return this.config;
        });
    }

    private async preparePackageEntities(pkg: Package): Promise<Package> {
        // Allow have strings instead of object
        pkg.entities = await Promise.all(
            (pkg.entities || []).map(async (ent) => {
                let entModel;
                if (typeof ent === "string") {
                    entModel = await this.sourcePool.loadEntity(ent);
                } else {
                    entModel = Utils.merge(
                        await this.sourcePool.loadEntity(ent.name),
                        ent,
                    );
                }
                if (entModel.platforms) {
                    entModel.platforms = (entModel.platforms || []).map((p: Platform | string) =>
                        typeof p === "string" ? new Platform({name: p}) : p,
                    );
                }
                return entModel;
            }),
        );
        pkg.packages = await  Promise.all(
            (pkg.packages || []).map((subPkg) => {
                return this.preparePackageEntities(subPkg);
            }),
        );
        return pkg;
    }

    private addGenerator(gen: ip0x0genGeneratorConfig | string, sources: SourcePool): p0x0generator {
        let cnf: ip0x0genGeneratorConfig = null,
            lang: string;
        if (typeof gen === "string") {
            lang = gen;
        } else {
            lang = gen.platform;
            cnf = gen;
        }
        if (!generators[lang]) throw new Error(`Invalid config: unknown generator ${lang}.`);
        return (new generators[lang](
            this.baseAppSourcesPath
            + (this.config.code &&  this.config.code.name ? `/${this.config.code.name}` : ""),
            cnf || {lang},
            sources,
        )) as p0x0generator;
    }
}
