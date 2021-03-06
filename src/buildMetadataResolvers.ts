import { IResolvers } from 'graphql-tools';
import { Metadata } from './Metadata';
import { MetadataOptions } from './MetadataOptions';

export function buildMetadataResolvers(
  metadata: Metadata[],
  options: MetadataOptions,
): IResolvers<any, any>
{
  const { metadataName } = options;

  function metadataResolver(): Metadata[]
  {
    return metadata;
  }

  return {
    Query: {
      [metadataName]: metadataResolver,
    }
  };
}
