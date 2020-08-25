import {_sources} from "p0x0res/sources";

const _sourceTypes = {};
for (const srct of _sources) {
    _sourceTypes[(new srct()).name] = srct;
}
export const sourceTypes = _sourceTypes;
