"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var toObjectValue = function (fields) {
    var result = {};
    for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
        var field = fields_1[_i];
        result[field.name.value] = toArgumentValue(field.value);
    }
    return result;
};
var toArgumentValue = function (valueNode) {
    switch (valueNode.kind) {
        case 'Variable':
            throw new TypeError('VariableNode is not supported as a directive argument');
        case 'FloatValue':
            return parseFloat(valueNode.value);
        case 'IntValue':
            return parseInt(valueNode.value, 10);
        case 'StringValue':
        case 'EnumValue':
        case 'BooleanValue':
            return valueNode.value;
        case 'ObjectValue':
            return toObjectValue(valueNode.fields);
        case 'NullValue':
            return null;
        case 'ListValue':
            return valueNode.values.map(toArgumentValue);
    }
};
exports.toMetadataArguments = function (args) {
    if (!args) {
        return [];
    }
    return args.map(function (arg) { return ({
        name: arg.name.value,
        value: JSON.stringify(toArgumentValue(arg.value))
    }); });
};
//# sourceMappingURL=astToMetadataArgument.js.map