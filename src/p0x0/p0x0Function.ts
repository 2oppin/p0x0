export class p0x0Function {
    public name?: string;
    public owner?: string; // if Binded to any entity as method
    public parent?: string; // if Binded to any entity as overridden method
    public isStatic?: boolean;
    public isPrivate?: boolean;
    public isProtected?: boolean;
    public arguments?: {[key: string]: string};
    public dependencies?: {[key: string]: string[]};
    public body: string;
}
