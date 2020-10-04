import {Model} from "p0x0/model";
import {Resource} from "p0x0/resource";
import {Script} from "p0x0/script";

export class Package extends Model {
    public name: string;
    public packages: Package[];
    public scripts: Script[];
    public entities: string[];
    public resources: Resource[];
}
