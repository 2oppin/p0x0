import {Model} from "p0x0/model";
import {Script} from "p0x0/script";

export class Container extends Model {
    public name: string;
    public image?: string;
    public dockerfile?: Script;
    public volumes: Map<string, string>;
    public scripts: Script[];
    public links: string[];
}
