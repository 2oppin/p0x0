import {Platform} from "p0x0/platform";
import {Resource} from "p0x0/resource";

export class Script extends Resource {
    public name: string;
    public platform: Platform;
    public params: {[key: string]: string};
    public body: Buffer;
    constructor(data: any) {
        super(data);
        if (data.platform) {
            this.platform = new Platform(data.platform);
        }
    }

    get interpreterString(): string {
        if (!this.platform.interpreter) throw new Error(`Not interpretational language/platform ${this.platform.name}`);
        return [
            this.platform.interpreter,
            Object.entries(this.params || {}).map((k, v) => `${k ? `-${k}` : ""} ${v}`).join(" "),
            this.name,
        ].join(" ");
    }

    get compileString(): string {
        if (!this.platform.compiler) throw new Error(`Not compiling language/platform ${this.platform.name}`);
        return [
            this.platform.compiler,
            Object.entries(this.params || {}).map((k, v) => `${k ? `-${k}` : ""} ${v}`).join(" "),
            this.name,
        ].join(" ");
    }
}
