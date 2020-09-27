import {p0x0convertor} from "./convertor";
import {formats} from "./formats";
import {ip0x0genResourceConfig, p0x0source} from "./source";
import {p0x0fileSource} from "./sources/files/file.source";
import {p0x0remoteSource} from "./sources/remote/remote.source";

const _formatTypes = {};
for (const srct of formats) {
    _formatTypes[(new srct()).type] = srct;
}
export const formatTypes: {[key: string]: p0x0convertor} = _formatTypes;

export function sourceFactory(conf: ip0x0genResourceConfig | string): p0x0source {
    let source: new(cnf: ip0x0genResourceConfig, conv: p0x0convertor) => p0x0source = p0x0fileSource;
    const cnf: ip0x0genResourceConfig = typeof conf === "string"
        ? {type: conf}
        : conf;
    if (cnf.url) {
        source = p0x0remoteSource;
    }
    return new source(cnf, new (formatTypes[cnf.type] as any)(cnf));
}
