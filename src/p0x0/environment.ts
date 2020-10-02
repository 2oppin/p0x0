import {Container} from "p0x0/container";
import {Model} from "p0x0/model";

export class Environment extends Model {
    public name: string;
    public containers: Container[];
}
