import { MetadataOptions } from './MetadataOptions';

export function buildMetadataTypeDefs({ metadataName }: MetadataOptions): string
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
