import {_sources} from "./sources";
import {_files} from "./sources/files";

const _sourceTypes = {};

for (const srct of _sources.concat(_files as any)) {
    _sourceTypes[(new srct()).name] = srct;
}
export let sourceTypes = _sourceTypes;
