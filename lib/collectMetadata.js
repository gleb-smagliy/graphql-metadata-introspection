"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Metadata_1 = require("./Metadata");
var graphql_1 = require("graphql");
var astToMetadataArgument_1 = require("./astToMetadataArgument");
function visitObjectField(typeName, field) {
    var directives = field.directives || [];
    var fieldName = field.name.value;
    return directives.map(function (directive) {
        var args = directive.arguments || [];
        return {
            typeName: typeName,
            fieldName: fieldName,
            name: directive.name.value,
            location: Metadata_1.MetadataLocation.OBJECT_FIELD,
            arguments: astToMetadataArgument_1.toMetadataArguments(args),
        };
    });
}
function visitObjectType(type) {
    var metadata = [];
    var typeName = type.name.value;
    var directives = type.directives || [];
    var typeMetadata = directives.map(function (directive) {
        var args = directive.arguments || [];
        return {
            typeName: typeName,
            name: directive.name.value,
            location: Metadata_1.MetadataLocation.OBJECT_TYPE,
            fieldName: null,
            arguments: astToMetadataArgument_1.toMetadataArguments(args)
        };
    });
    var fields = (type.fields || []);
    var fieldsMetadata = fields
        .reduce(function (result, field) {
        var fieldResult = visitObjectField(typeName, field);
        result.push.apply(result, fieldResult);
        return result;
    }, []);
    metadata.push.apply(metadata, typeMetadata);
    metadata.push.apply(metadata, fieldsMetadata);
    return metadata;
}
function visitDocument(document) {
    var _a;
    var metadata = [];
    var visitor = (_a = {},
        _a[graphql_1.Kind.OBJECT_TYPE_DEFINITION] = function (type) {
            var typeMetadata = visitObjectType(type);
            metadata.push.apply(metadata, typeMetadata);
        },
        _a);
    graphql_1.visit(document, visitor);
    return metadata;
}
function collectMetadata(document) {
    return visitDocument(document);
}
exports.collectMetadata = collectMetadata;
//# sourceMappingURL=collectMetadata.js.map