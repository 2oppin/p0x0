/**
 * p0x0 Data Provider
 */
import {ip0x0, p0x0} from "../p0x0/p0x0";

export interface ip0x0dp extends ip0x0 {
    create: (p0x0) => any;
    update: (id: any, p0x0) => p0x0;
    get: (id: any) => p0x0;
    search: (any) => p0x0[];
}

export abstract class p0x0dp extends p0x0 {
    abstract create: (p0x0) => any;
    abstract update: (id: any, p0x0) => p0x0;
    abstract get: (id: any) => p0x0;
    abstract search: (any) => p0x0[];
}