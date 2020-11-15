import * as path from "path";

import {Container} from "p0x0/container";
import {Environment} from "p0x0/environment";

export class dockerCompose {
    public prepare(env: Environment, output: string): string {
        return `\
version: '3'
services:
${env.containers.map(this.prepareContainer(output))}`;
    }

    protected prepareContainer(output: string) {
        return (container: Container): string  => {
            return `  ${container.name}:\n` +
                (container.image
?
`    image: ${container.image}\n`
:
`    build:
      context: ./${path.relative(output, `${output}/${container.name}`)}
      dockerfile: ${container.dockerfile.name}`) +
`\n    tty: true
    volumes:\n` +
        Object.entries(container.volumes).map(([src, dst]) =>
`      - ${src}:${dst}`,
).join("\n")
                + `${container.cmd ?
`\n    command: ${container.cmd}` : ""}`
                + (container.links
                    ?
`\n    links:\n
      -${container.links.join("\n      -")}`
                    : ""
                )
                + "\n"
;
        };
    }
}
