import {_sources} from "./sources";
import {_files} from "./sources/files";

var _sourceTypes = {};

for(let srct of _sources.concat(_files)) {
    _sourceTypes[(new srct).name] = srct;
}
export var sourceTypes = _sourceTypes;