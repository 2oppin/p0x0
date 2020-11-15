import {Model} from "p0x0/model";
import {Script} from "p0x0/script";

export class Container {
    public name: string;
    public image?: string;
    public cmd: String;
    public dockerfile?: Script;
    public volumes: Map<string, string>;
    public scripts: Script[];
    public links: string[];
    constructor(data: any) {
        this.name = data.name;
        this.image = data.image;
        this.cmd = data.cmd;
        this.dockerfile = data.dockerfile ? new Script(data.dockerfile) : null;
        this.volumes = data.volumes;
        if (data.scripts) {
            this.scripts = data.scripts.map((s) => new Script(s));
        }
    }
}
