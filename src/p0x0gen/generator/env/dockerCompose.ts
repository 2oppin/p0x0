import {Container} from "p0x0/container";
import {Environment} from "p0x0/environment";

export class dockerCompose {
    public prepare(env: Environment): string {
        return `\
version: '3'
  services:
${env.containers.map(this.prepareContainer)}`;
    }

    public prepareContainer(container: Container): string {
        return container.image
            ?
`    image: ${container.image}\n`
            :
`    build:
        context: ${container.build.name}` +
`\n    tty: true
    volumes:\n` +
        Object.entries(container.volumes).map(([src, dst]) =>
`        - ${src}:${dst}`,
).join("\n") + `${container.scripts && container.scripts.length ?
`\n    command: bash -c "${container.scripts.map((s) => s.interpreterString).join(" && ")}"` : ""}
`;
    }
}
