import {Container} from "p0x0/container";
import {Model} from "p0x0/model";

export class Environment {
    public name: string;
    public containers: Container[];
    constructor(data: any) {
        this.name = data.name;
        if (data.containers) {
            this.containers = data.containers.map((c) => new Container(c));
        }
    }
}
