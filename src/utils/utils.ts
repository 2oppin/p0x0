export class Utils {
    public static randomColor = (base: number = 0): string =>
        "rgb(" + ["", "", ""].map(() => base + Math.round(Math.random() * (255 - base))).join() + ")"

    public static capitaize = (s: string): string => s[0].toUpperCase() + s.slice(1);

    public static e = (_enum: any, val: any): string => Number.isNaN(+val) ? _enum[_enum[val]] : _enum[val];
    public static el = (_enum: any): string[] => Object.getOwnPropertyNames(_enum).filter((v: any) => Number.isNaN(+v));
    public static en = (_enum: any, val: any): number => Number.isNaN(+val) ? _enum[val] : _enum[_enum[val]];
    public static enl = (_enum: any): number[] =>
        Object.getOwnPropertyNames(_enum).map((v: string) => _enum[v]).filter((v: any) => !Number.isNaN(+v))

    public static floor = (val, prc) => (Math.floor(val * (10 ** prc)) / (10 ** prc));
    public static sum =
        (_arr: number[]): number => _arr.length ? _arr.slice(0).reduce((a: number, b: number) => a + b, 0) : 0
    public static sumo = (_arr: any[], prop: string): number => Utils.sum(_arr.map((a) => a[prop]));
    public static avg = (_arr: number[]): number => _arr.length ? Utils.sum(_arr) / _arr.length : 0;
    public static avgo = (_arr: any[], prop: string): number => _arr.length ? Utils.sumo(_arr, prop) / _arr.length : 0;
    public static bigX = (_arr: number[], x: number): number[] => _arr.slice(0).sort((a, b) => b - a).slice(0, x);
    public static big3 = (_arr: number[]): number[] => Utils.bigX(_arr, 3);
    public static big3o =
        (_arr: any[], prop: string): any[] => _arr.slice(0).sort((a, b) => b[prop] - a[prop]).slice(0, 3)
    // @ts-ignore
    public static dstr = (n: number): number[] => [...new Array(n)]
        .reduce((a, _, i) => a[1].push(-a[0] + (a[0] += (1 - a[0]) * (n - i < 2 ? 1 : Math.random()))) && a, [0, []])[1]
    public static diffMonths =
        (d1: Date, d2: Date) =>  d2.getFullYear() * 12 + d2.getMonth() - d1.getFullYear() * 12 - d1.getMonth()

    public static merge(obj: any, obj2: any) {
        if (typeof obj2 !== "object" || !obj) return obj2;
        Object.entries(obj2).forEach(([key, value]) => {
            obj[key] = Utils.merge(obj[key], value);
        });
        return obj;
    }

    public static deepCopy(obj: any) {
        let copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" !== typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = Utils.deepCopy(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (const attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = Utils.deepCopy(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }
}
