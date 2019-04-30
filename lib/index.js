"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var graphql_tools_1 = require("graphql-tools");
var MetadataOptions_1 = require("./MetadataOptions");
var buildMetadataTypeDefs_1 = require("./buildMetadataTypeDefs");
var buildMetadataResolvers_1 = require("./buildMetadataResolvers");
function makeExecutableSchema(schemaDefinition, options) {
    if (options === void 0) { options = MetadataOptions_1.DEFAULT_METADATA_OPTIONS; }
    var typeDefs = schemaDefinition.typeDefs, resolvers = schemaDefinition.resolvers, other = tslib_1.__rest(schemaDefinition, ["typeDefs", "resolvers"]);
    var metadataSchema = graphql_tools_1.makeExecutableSchema({
        typeDefs: buildMetadataTypeDefs_1.buildMetadataTypeDefs(options),
        resolvers: buildMetadataResolvers_1.buildMetadataResolvers(options)
    });
    var originalSchema = graphql_tools_1.makeExecutableSchema(tslib_1.__assign({ typeDefs: typeDefs, resolvers: resolvers }, other));
    return graphql_tools_1.mergeSchemas({
        schemas: [originalSchema, metadataSchema]
    });
}
exports.makeExecutableSchema = makeExecutableSchema;
//# sourceMappingURL=index.js.map