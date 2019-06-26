"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildMetadataTypeDefs(_a) {
    var metadataName = _a.metadataName;
    return "\n        enum MetadataLocation {\n            OBJECT_TYPE,\n            OBJECT_FIELD,\n        }\n\n        type MetadataArgument {\n            name: String!\n            value: String!\n        }\n\n        type Metadata {\n            name: String!\n            location: MetadataLocation!\n            typeName: String!\n            fieldName: String\n            arguments: [MetadataArgument]!\n        }\n\n        extend type Query {\n            " + metadataName + ": [Metadata!]!\n        }\n    ";
}
exports.buildMetadataTypeDefs = buildMetadataTypeDefs;
//# sourceMappingURL=buildMetadataTypeDefs.js.map