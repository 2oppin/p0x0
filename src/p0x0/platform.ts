import {Entity} from "./entity";

export class Platform extends Entity {
    public name: string;
    public interpreter: string;
    public compiler: string;
    public linter: string;
    public next: Platform;
}
