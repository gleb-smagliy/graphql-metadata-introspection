"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var graphql_tools_1 = require("graphql-tools");
var DEFAULT_METADATA_OPTIONS = {
    metadataName: '_metadata'
};
function buildMetadataTypeDefs(_a) {
    var metadataName = _a.metadataName;
    return "\n        enum MetadataLocation {\n            OBJECT_TYPE,\n            OBJECT_FIELD,\n        }\n    \n        type MetadataArgument {\n            name: String!\n            value: String!\n        }\n    \n        type Metadata {\n            name: String!\n            location: MetadataLocation!\n            typeName: String!\n            fieldName: String\n            arguments: [MetadataArgument]!\n        }\n    \n        type Query {\n            " + metadataName + ": [Metadata!]!\n        }\n    ";
}
var MetadataLocation;
(function (MetadataLocation) {
    MetadataLocation["OBJECT_TYPE"] = "OBJECT_TYPE ";
    MetadataLocation["OBJECT_FIELD"] = "OBJECT_FIELD";
})(MetadataLocation || (MetadataLocation = {}));
function buildMetadataResolvers(_a) {
    var _b;
    var metadataName = _a.metadataName;
    function metadataResolver() {
        return [{
                name: 'ref',
                location: MetadataLocation.OBJECT_FIELD,
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
function makeExecutableSchema(schemaDefinition, options) {
    if (options === void 0) { options = DEFAULT_METADATA_OPTIONS; }
    var typeDefs = schemaDefinition.typeDefs, resolvers = schemaDefinition.resolvers, other = tslib_1.__rest(schemaDefinition, ["typeDefs", "resolvers"]);
    var metadataSchema = graphql_tools_1.makeExecutableSchema({
        typeDefs: buildMetadataTypeDefs(options),
        resolvers: buildMetadataResolvers(options)
    });
    var originalSchema = graphql_tools_1.makeExecutableSchema(tslib_1.__assign({ typeDefs: typeDefs, resolvers: resolvers }, other));
    return graphql_tools_1.mergeSchemas({
        schemas: [originalSchema, metadataSchema]
    });
}
exports.makeExecutableSchema = makeExecutableSchema;
//# sourceMappingURL=index.js.map