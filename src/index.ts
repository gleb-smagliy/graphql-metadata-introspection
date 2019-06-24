import { GraphQLSchema } from 'graphql';
import {
  IExecutableSchemaDefinition,
  makeExecutableSchema as makeGraphqlSchema,
} from 'graphql-tools';
import { MetadataOptions, DEFAULT_METADATA_OPTIONS } from './MetadataOptions';
import { buildMetadataTypeDefs } from './buildMetadataTypeDefs';
import { buildMetadataResolvers } from './buildMetadataResolvers';
import { collectMetadata } from './collectMetadata';
import { definitionsToDocument } from './definitionsToDocument';
import { mergeResolversToArray } from './mergeResolversToArray';

export function makeExecutableSchema<T = any>(
    schemaDefinition: IExecutableSchemaDefinition<T>,
    options: MetadataOptions = DEFAULT_METADATA_OPTIONS,
): GraphQLSchema
{
  const {
    typeDefs: originalTypeDefs,
    resolvers: originalResolvers,
    ...other
  } = schemaDefinition;

  const externalTypeDefs = Array.isArray(originalTypeDefs) ? originalTypeDefs : [originalTypeDefs];

  const schemaDefs = [
    buildMetadataTypeDefs(options),
    ...externalTypeDefs
  ];

  const schemaDocument = definitionsToDocument(schemaDefs);
  const metadata = collectMetadata(schemaDocument);

  const metadataResolvers = buildMetadataResolvers(metadata, options);

  return makeGraphqlSchema({
    typeDefs: schemaDocument,
    resolvers: mergeResolversToArray(originalResolvers, metadataResolvers),
    ...other
  });
}
