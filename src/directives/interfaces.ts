import { DocumentNode, Source } from "graphql";
import { FIELDS_DIRECTIVES_QUERY_NAME, TYPES_DIRECTIVES_QUERY_NAME } from './directives-schema';

export interface IDirectiveDefinition
{
  name: string
  arguments: Array<object>
}

export interface ITypeDirectiveDefinition extends IDirectiveDefinition
{
  typeName: string
}

export interface IFieldDirectiveDefinition extends IDirectiveDefinition
{
  typeName: string
  fieldName: string
}

export interface IDirectivesDefinition
{
  typesDirectives: Array<ITypeDirectiveDefinition>,
  fieldsDirectives: Array<IFieldDirectiveDefinition>
}

export interface ISchemaDefinition
{
  typeDefs: Array<string | Source | DocumentNode>,
  resolvers: any
}

export interface IDirectivesQueryResolver
{
  Query: {
    [TYPES_DIRECTIVES_QUERY_NAME]: () => Array<ITypeDirectiveDefinition>,
    [FIELDS_DIRECTIVES_QUERY_NAME]: () => Array<IFieldDirectiveDefinition>
  },
  DirectiveArgumentsJson: any
}