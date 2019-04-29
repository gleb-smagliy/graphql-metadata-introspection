import {
  visit,
  Kind,
  DocumentNode,
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
  ASTKindToNode,
  Visitor,
  GraphQLSchema,
  ArgumentNode
} from 'graphql';

import {
  ITypeDirectiveDefinition,
  IFieldDirectiveDefinition,
  IDirectivesDefinition,
  IDirectivesQueryResolver,
  ISchemaDefinition
} from './interfaces';

import { makeExecutableSchema } from 'graphql-tools';
import { gql } from 'apollo-server-lambda';
import directivesSchema, { FIELDS_DIRECTIVES_QUERY_NAME, TYPES_DIRECTIVES_QUERY_NAME } from './directives-schema';
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
const GraphQLJSON = require('graphql-type-json');
const flatMap = require('lodash.flatmap');
import omitDeep from './omit-deep';

const omitLocation = (input: ArgumentNode) => omitDeep(input, ['loc']);

// const mapArgument = (argument: ArgumentNode): object => omitLocation(argument);

const getFieldDirectives = (
  type: ObjectTypeDefinitionNode,
  field: FieldDefinitionNode
): IFieldDirectiveDefinition[] =>
{
  return field.directives
    .map(directive => (
      {
        typeName: type.name.value,
        fieldName: field.name.value,
        name: directive.name.value,
        arguments: directive.arguments.map(omitLocation)
      }
    ));
};

function getTypeDirectives(type: ObjectTypeDefinitionNode): Array<ITypeDirectiveDefinition>
{
  return type.directives.map(directive => ({
    typeName: type.name.value,
    name: directive.name.value,
    arguments: directive.arguments.map(omitLocation)
  }));
}

function createObjectTypeVisitor(
  fieldsDirectives: Array<IFieldDirectiveDefinition>,
  typesDirectives: Array<ITypeDirectiveDefinition>
): Visitor<ASTKindToNode>
{
  return {
    [Kind.OBJECT_TYPE_DEFINITION](node)
    {
      fieldsDirectives.push(...flatMap(node.fields, field => getFieldDirectives(node, field)));
      typesDirectives.push(...getTypeDirectives(node));
    }
  };
}

function retrieveDirectives(document: DocumentNode): IDirectivesDefinition
{
  const fieldsDirectives: Array<IFieldDirectiveDefinition> = [];
  const typesDirectives: Array<ITypeDirectiveDefinition> = [];

  visit(document, createObjectTypeVisitor(fieldsDirectives, typesDirectives));

  return {
    fieldsDirectives,
    typesDirectives
  };
}

export function createDirectivesResolver(document: DocumentNode) : IDirectivesQueryResolver
{
  const { fieldsDirectives, typesDirectives } = retrieveDirectives(document);

  return {
    Query: {
      [FIELDS_DIRECTIVES_QUERY_NAME]: () => fieldsDirectives,
      [TYPES_DIRECTIVES_QUERY_NAME]: () => typesDirectives
    },
    DirectiveArgumentsJson: GraphQLJSON
  }
}

export default (schema: ISchemaDefinition) : GraphQLSchema =>
{
  const { typeDefs: originalTypes, resolvers: originalResolvers, ...other } = schema;

  const mergedAst = gql(mergeTypes(originalTypes, { all: true }));

  const resolvers = mergeResolvers([
    originalResolvers,
    createDirectivesResolver(mergedAst)
  ]);

  const types = mergeTypes([mergedAst, directivesSchema]);

  return makeExecutableSchema({ typeDefs: types, resolvers: resolvers, ...other });
};
