import * as fs from "fs";
import {Container} from "p0x0/container";
import * as path from "path";

import {Environment} from "p0x0/environment";
import {dockerCompose} from "p0x0gen/generator/env/dockerCompose";

export class EnvGenerator {
    protected output: string;

    constructor(
        protected env: Environment,
        output: string,
    ) {
        this.env.name = `${output}/${this.env.name}`;
        this.output = path.dirname(this.env.name);
    }

    public async run(): Promise<any> {
        // Prepare docker-compose.yaml out of Environment entity
        await fs.promises.mkdir(this.output, {recursive: true})
            .then(() =>
                fs.promises.writeFile(this.env.name, (new dockerCompose()).prepare(this.env, this.output)),
            );
        await Promise.all(
            this.env.containers.map((c) => this.prepareContainerFiles(c)),
        );
    }

    protected async prepareContainerFiles(container: Container): Promise<any> {
        if (container.image) return Promise.resolve();
        if (!container.dockerfile || !container.dockerfile.name)
            throw new Error("Container has nor image nor custom Dockerfile");

        const dir = `${this.output}/${container.name}`;
        await fs.promises.mkdir(`${dir}`, {recursive: true});
        (container.scripts || []).forEach(async (script) =>
            await fs.promises.mkdir(
                path.dirname(`${dir}/${script.name}`),
                {recursive: true},
            ),
        );
        return Promise.all([
            fs.promises.writeFile(
                `${dir}/${container.dockerfile.name}`,
                container.dockerfile.body,
            ),
            ...(container.scripts || []).map((script) =>
                fs.promises.writeFile(
                    `${dir}/${script.name}`,
                    script.body,
                ),
            ),
        ]);
    }
}
