import {Platform} from "p0x0/platform";
import {Resource} from "p0x0/resource";

export class Script extends Resource {
    public name: string;
    public platform: Platform;
    public params: string[];
    public body: string;

    get interpreterString(): string {
        if (!this.platform.interpreter) throw new Error(`Not interpretational language/platform ${this.platform.name}`);
        return `${this.platform.interpreter} ${this.params.join(" ")} ${this.name}`;
    }

    get compileString(): string {
        if (!this.platform.interpreter) throw new Error(`Not interpretational language/platform ${this.platform.name}`);
        return `${this.platform.interpreter} ${this.params.join(" ")} ${this.name}`;
    }
}
