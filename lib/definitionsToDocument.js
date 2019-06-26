"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
function joinDefiniions(definitions) {
    return definitions.map(function (d) { return d.trim(); }).join('\n');
}
function definitionToString(typeDef) {
    if (typeof typeDef === 'function') {
        return definitionsToString(typeDef());
    }
    if (typeof typeDef === 'string') {
        return typeDef;
    }
    if (typeof typeDef === 'object' && typeDef.kind !== undefined) {
        return graphql_1.print(typeDef);
    }
    throw new Error("Expected all typeDefs to be string, function or DocumentNode, instead got " + typeof (typeDef) + "\n  ");
}
function definitionsToString(typeDefs) {
    var definitions = typeDefs.map(definitionToString);
    return joinDefiniions(definitions);
}
function definitionsToDocument(typeDefs) {
    var strDefs = definitionsToString(typeDefs);
    return graphql_1.parse(strDefs);
}
exports.definitionsToDocument = definitionsToDocument;
//# sourceMappingURL=definitionsToDocument.js.map