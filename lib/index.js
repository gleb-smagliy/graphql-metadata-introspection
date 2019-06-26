"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var graphql_tools_1 = require("graphql-tools");
var MetadataOptions_1 = require("./MetadataOptions");
var buildMetadataTypeDefs_1 = require("./buildMetadataTypeDefs");
var buildMetadataResolvers_1 = require("./buildMetadataResolvers");
var collectMetadata_1 = require("./collectMetadata");
var definitionsToDocument_1 = require("./definitionsToDocument");
var mergeResolversToArray_1 = require("./mergeResolversToArray");
function makeExecutableSchema(schemaDefinition, options) {
    if (options === void 0) { options = MetadataOptions_1.DEFAULT_METADATA_OPTIONS; }
    var originalTypeDefs = schemaDefinition.typeDefs, originalResolvers = schemaDefinition.resolvers, other = tslib_1.__rest(schemaDefinition, ["typeDefs", "resolvers"]);
    var externalTypeDefs = Array.isArray(originalTypeDefs) ? originalTypeDefs : [originalTypeDefs];
    var schemaDefs = [
        buildMetadataTypeDefs_1.buildMetadataTypeDefs(options)
    ].concat(externalTypeDefs);
    var schemaDocument = definitionsToDocument_1.definitionsToDocument(schemaDefs);
    var metadata = collectMetadata_1.collectMetadata(schemaDocument);
    var metadataResolvers = buildMetadataResolvers_1.buildMetadataResolvers(metadata, options);
    return graphql_tools_1.makeExecutableSchema(tslib_1.__assign({ typeDefs: schemaDocument, resolvers: mergeResolversToArray_1.mergeResolversToArray(originalResolvers, metadataResolvers) }, other));
}
exports.makeExecutableSchema = makeExecutableSchema;
//# sourceMappingURL=index.js.map