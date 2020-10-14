import {Model} from "p0x0/model";

export class Platform extends Model {
    public name: string;
    public interpreter: string;
    public compiler: string;
    public linter: string;
    public next: Platform;
}
