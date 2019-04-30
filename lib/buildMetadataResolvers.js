"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Metadata_1 = require("./Metadata");
function buildMetadataResolvers(_a) {
    var _b;
    var metadataName = _a.metadataName;
    function metadataResolver() {
        return [{
                name: 'ref',
                location: Metadata_1.MetadataLocation.OBJECT_FIELD,
                typeName: 'Event',
                fieldName: 'ownerId',
                arguments: [
                    { name: 'query', 'value': JSON.stringify("contactById") },
                    { name: 'as', 'value': JSON.stringify("owner") }
                ]
            }];
    }
    return {
        Query: (_b = {},
            _b[metadataName] = metadataResolver,
            _b)
    };
}
exports.buildMetadataResolvers = buildMetadataResolvers;
//# sourceMappingURL=buildMetadataResolvers.js.map