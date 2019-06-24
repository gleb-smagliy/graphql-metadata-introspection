export interface MetadataArgument
{
  name: string;
  value: string;
}

export enum MetadataLocation
{
    OBJECT_TYPE = 'OBJECT_TYPE ',
    OBJECT_FIELD = 'OBJECT_FIELD',
}

export interface Metadata
{
  name: string;
  location: MetadataLocation;
  typeName: string;
  fieldName: string;
  arguments: MetadataArgument[];
}
