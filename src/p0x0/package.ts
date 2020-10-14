import * as fs from "fs";

import {Entity} from "p0x0/entity";
import {Model} from "p0x0/model";
import {Resource} from "p0x0/resource";
import {Script} from "p0x0/script";
import {p0x0generator} from "p0x0gen/generator/generator";

export class Package extends Model {
    public name: string;
    public packages: Package[];
    public scripts: Script[];
    public entities: Entity[];
    public resources: Resource[];

    constructor(data: any) {
        super(data);
        this.packages = (this.packages || []).map((p) => new Package(p));
        this.entities = (this.entities || []).map((e) =>
            new Entity({...e, package: this.name}),
        );
        this.scripts = (this.scripts || []).map((s) => new Script(s));
        this.resources = (this.resources || []).map((r) => new Resource(r));
    }

    public generate(baseDir: string, generators: p0x0generator[]): Promise<any> {
        const pkgPath = this.name ? `${baseDir}/${this.name}` : baseDir;
        if (!fs.existsSync(pkgPath)) {
            fs.mkdirSync(pkgPath, {recursive: true});
        }

        return Promise.all([
            ...(this.packages || []).map((p) =>
                p.generate(pkgPath, generators),
            ),
            ...(this.entities || []).map(
                (entity: Entity) => {
                    generators.map((gen) => {
                        if (!entity.platforms
                            || entity.platforms.find(
                                (pl) => gen.platform.name === pl.name,
                            )
                        )
                            gen.generate(entity, pkgPath);
                    });
                }),
        ])
            .then(() => Promise.all([
                ...(this.scripts || []).map(
                    (script) => p0x0generator
                        .generateRaw(`${pkgPath}/${script.name}`, script.body),
                ),
            ]))
            .then(() => Promise.all([
                ...(this.resources || []).map(
                    (script) => p0x0generator
                        .generateRaw(`${pkgPath}/${script.name}`, script.body),
                ),
            ]));
    }
}
