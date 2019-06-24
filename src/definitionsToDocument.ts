import { ITypedef } from 'graphql-tools';
import { DocumentNode, parse, print } from 'graphql';

function joinDefiniions(definitions: string[])
{
  return definitions.map(d => d.trim()).join('\n');
}

function definitionToString(typeDef: ITypedef) : string
{
  if (typeof typeDef === 'function')
  {
    return definitionsToString(typeDef());
  }

  if (typeof typeDef === 'string')
  {
    return typeDef;
  }

  if (typeof typeDef === 'object' && typeDef.kind !== undefined)
  {
    return print(typeDef);
  }

  throw new Error(
    `Expected all typeDefs to be string, function or DocumentNode, instead got ${typeof(typeDef)}
  `);
}

function definitionsToString(typeDefs: ITypedef[]): string
{
  const definitions = typeDefs.map(definitionToString);

  return joinDefiniions(definitions);
}

export function definitionsToDocument(typeDefs: ITypedef[]): DocumentNode
{
  const strDefs = definitionsToString(typeDefs);

  return parse(strDefs);
}
