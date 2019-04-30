import { IResolvers } from 'graphql-tools';
import { Metadata, MetadataLocation } from './Metadata';
import { MetadataOptions } from './MetadataOptions';

export function buildMetadataResolvers({ metadataName }: MetadataOptions): IResolvers<any, any>
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