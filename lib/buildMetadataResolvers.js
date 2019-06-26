"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildMetadataResolvers(metadata, options) {
    var _a;
    var metadataName = options.metadataName;
    function metadataResolver() {
        return metadata;
    }
    return {
        Query: (_a = {},
            _a[metadataName] = metadataResolver,
            _a)
    };
}
exports.buildMetadataResolvers = buildMetadataResolvers;
//# sourceMappingURL=buildMetadataResolvers.js.map