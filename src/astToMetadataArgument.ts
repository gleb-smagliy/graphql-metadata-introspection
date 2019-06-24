import { ArgumentNode, ObjectFieldNode, ValueNode } from 'graphql';
import { MetadataArgument } from "./Metadata";
// import { ArgumentNode, ObjectFieldNode, ValueNode } from 'graphql';
// import { MetadataArgument } from './Metadata';

const toObjectValue = (fields: ReadonlyArray<ObjectFieldNode>): object =>
{
  const result: { [key: string]: any } = {};

  for (const field of fields)
  {
    result[field.name.value] = toArgumentValue(field.value);
  }

  return result;
};

const toArgumentValue = (valueNode: ValueNode): any =>
{
  switch (valueNode.kind)
  {
    case 'Variable':
      throw new TypeError('VariableNode is not supported as a directive argument');
    case 'StringValue':
    case 'EnumValue':
    case 'FloatValue':
      return valueNode.value;
    case 'ObjectValue':
      return toObjectValue(valueNode.fields);
    case 'NullValue':
      return null;
    case 'ListValue':
      return valueNode.values.map(toArgumentValue);
  }
};

export const toMetadataArguments = (args: ArgumentNode[]): MetadataArgument[]=> {
  if (!args)
  {
    return [];
  }

  return args.map(arg => ({
    name: arg.name.value,
    value: JSON.stringify(toArgumentValue(arg.value))
  }));
};
