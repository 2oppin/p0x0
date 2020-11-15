export class Resource {
    public name: string;
    public body: Buffer;
    constructor({name, body}) {
        this.name = name;
        this.body = Buffer.from(body);
    }
}
