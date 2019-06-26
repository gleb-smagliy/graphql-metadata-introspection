"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var resolversToArray = function (resolver) {
    if (resolver === undefined) {
        return [];
    }
    if (Array.isArray(resolver)) {
        return resolver;
    }
    return [resolver];
};
function mergeResolversToArray(leftResolvers, rightResolvers) {
    if (leftResolvers === undefined && rightResolvers === undefined) {
        return undefined;
    }
    if (leftResolvers !== undefined && rightResolvers === undefined) {
        return resolversToArray(leftResolvers);
    }
    if (leftResolvers === undefined && rightResolvers !== undefined) {
        return resolversToArray(rightResolvers);
    }
    return resolversToArray(leftResolvers).concat(resolversToArray(rightResolvers));
}
exports.mergeResolversToArray = mergeResolversToArray;
//# sourceMappingURL=mergeResolversToArray.js.map