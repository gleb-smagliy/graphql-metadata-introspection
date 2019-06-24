import { GraphQLSchema, parse } from 'graphql';
import {
    IExecutableSchemaDefinition,
    makeExecutableSchema as makeGraphqlSchema,
    mergeSchemas
} from 'graphql-tools';
import { MetadataOptions, DEFAULT_METADATA_OPTIONS } from './MetadataOptions';
import { buildMetadataTypeDefs } from './buildMetadataTypeDefs';
import { buildMetadataResolvers } from './buildMetadataResolvers';
import { collectMetadata } from './collectMetadata';

export function makeExecutableSchema<T = any>(
    sdl: string,
    schemaDefinition: IExecutableSchemaDefinition<T>,
    options: MetadataOptions = DEFAULT_METADATA_OPTIONS,
): GraphQLSchema
{
  const { typeDefs, resolvers, parseOptions, ...other } = schemaDefinition;

  // // need to built then print to preserve original makeExecutableSchema capabilities
  // const schema = buildSchemaFromTypeDefinitions(typeDefs, parseOptions);
  // const sdl = parse(printSchema(schema));
  const document = parse(sdl);

  const metadata = collectMetadata(document);

  const metadataSchema = makeGraphqlSchema({
    typeDefs: buildMetadataTypeDefs(options),
    resolvers: buildMetadataResolvers(options, metadata),
  });

  const originalSchema = makeGraphqlSchema({ typeDefs, resolvers, ...other });

  return mergeSchemas({
    schemas: [originalSchema, metadataSchema],
  });
}
