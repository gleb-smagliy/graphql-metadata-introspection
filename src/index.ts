import { GraphQLSchema } from 'graphql'
import {
    IExecutableSchemaDefinition,
    makeExecutableSchema as makeGraphqlSchema,
    mergeSchemas,
    IResolvers
} from 'graphql-tools';

export interface MetadataOptions
{
    metadataName: string
}

const DEFAULT_METADATA_OPTIONS: MetadataOptions = {
  metadataName: '_metadata'
};

function buildMetadataTypeDefs({ metadataName }: MetadataOptions): string
{
    return `
        enum MetadataLocation {
            OBJECT_TYPE,
            OBJECT_FIELD,
        }
    
        type MetadataArgument {
            name: String!
            value: String!
        }
    
        type Metadata {
            name: String!
            location: MetadataLocation!
            typeName: String!
            fieldName: String
            arguments: [MetadataArgument]!
        }
    
        type Query {
            ${metadataName}: [Metadata!]!
        }
    `;
}

interface MetadataArgument
{
    name: string,
    value: string
}

enum MetadataLocation
{
    OBJECT_TYPE = 'OBJECT_TYPE ',
    OBJECT_FIELD = 'OBJECT_FIELD',
}

interface Metadata
{
    name: string,
    location: MetadataLocation,
    typeName: string,
    fieldName: string,
    arguments: Array<MetadataArgument>
}

function buildMetadataResolvers({ metadataName }: MetadataOptions): IResolvers<any, any>
{
    function metadataResolver(): Array<Metadata>
    {
        return [{
            name: 'ref',
            location: MetadataLocation.OBJECT_FIELD,
            typeName: 'Event',
            fieldName: 'ownerId',
            arguments: [
                { name: 'query', 'value': JSON.stringify("contactById") },
                { name: 'as', 'value': JSON.stringify("owner") }
            ]
        }]
    }

    return {
        Query: {
            [metadataName]: metadataResolver
        }
    }
}

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