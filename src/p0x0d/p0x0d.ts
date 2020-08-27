/**
 * generator Data (usually DB, but can be rest or any other storage)
 */
import {ip0x0, p0x0} from "../p0x0/p0x0";
import {p0x0dp} from "./p0x0dp";

export interface ip0x0d extends ip0x0 {
    create: (p0x0) => any;
    update: (id: any, p0x0) => p0x0;
    get: (id: any) => p0x0;
    search: (any) => p0x0[];
}

export class p0x0d extends p0x0 implements ip0x0d {
    constructor(private _provider: p0x0dp) {super(); }
    public create = (obj: p0x0) => this._provider.create(obj);
    public update = (id: any, obj: p0x0) => this._provider.update(id, obj);
    public get =  (id: any) => this._provider.get(id);
    public search = (cond: any) => this._provider.search(cond);
}
