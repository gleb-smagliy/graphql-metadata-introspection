import { GraphQLSchema } from 'graphql'
import {
    IExecutableSchemaDefinition,
    makeExecutableSchema as makeGraphqlSchema,
    mergeSchemas
} from 'graphql-tools';
import { MetadataOptions, DEFAULT_METADATA_OPTIONS } from './MetadataOptions';
import { buildMetadataTypeDefs } from './buildMetadataTypeDefs';
import { buildMetadataResolvers } from './buildMetadataResolvers'


export function makeExecutableSchema<T = any>(
    schemaDefinition: IExecutableSchemaDefinition<T>,
    options: MetadataOptions = DEFAULT_METADATA_OPTIONS
): GraphQLSchema
{
    const { typeDefs, resolvers, ...other } = schemaDefinition;

    const metadataSchema = makeGraphqlSchema({
        typeDefs: buildMetadataTypeDefs(options),
        resolvers: buildMetadataResolvers(options)
    });

    const originalSchema = makeGraphqlSchema({ typeDefs, resolvers, ...other });

    return mergeSchemas({
        schemas: [originalSchema, metadataSchema]
    })
}