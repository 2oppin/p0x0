import * as fs from "fs";

import {Entity} from "p0x0/entity";
import {Model} from "p0x0/model";
import {Resource} from "p0x0/resource";
import {Script} from "p0x0/script";
import {p0x0generator} from "p0x0gen/generator/generator";

export class Package extends Model {
    public name: string;
    public parent: Partial<Package>;
    public packages: Package[];
    public scripts: Script[];
    public entities: Entity[];
    public resources: Resource[];

    constructor(data: any) {
        const {parent, name} = data;
        super({parent, name});
        this.packages = (data.packages || []).map((p) =>
            new Package({...p, parent: {name: this.name, parent: this.parent}})
        );
        this.entities = (data.entities || []).map((e) =>
            new Entity({...e, package: this.fullName}),
        );
        this.scripts = (data.scripts || []).map((s) => new Script(s));
        this.resources = (data.resources || []).map((r) => new Resource(r));
    }

    get fullName(): string {
        let parent = this.parent;
        let fullName = this.name;
        while(parent) {
            fullName = `${parent.name}/${fullName}`;
            parent = parent.parent;
        }
        return fullName;
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
                (entity: Entity) =>
                    Promise.all(
                        generators
                            .filter((gen) =>
                                !entity.platforms || entity.platforms.find(
                                    (pl) => gen.platform.name === pl.name,
                                ),
                            )
                            .map((gen) => gen.generate(entity, pkgPath))
                    ),
                ),
        ])
            .then(() => Promise.all([
                ...(this.scripts || []).map(
                    (script) => p0x0generator
                        .generateRaw(`${pkgPath}/${script.name}`, Buffer.from(script.body)),
                ),
            ]))
            .then(() => Promise.all([
                ...(this.resources || []).map(
                    (res) => {
                        const body = res.body;
                        const data = Buffer.from(res.body);
                        return p0x0generator
                            .generateRaw(`${pkgPath}/${res.name}`, data)
                    },
                ),
            ]));
    }
}
