import { Metadata, MetadataLocation } from './Metadata';
import { DocumentNode, FieldDefinitionNode, Kind, ObjectTypeDefinitionNode, visit } from 'graphql';
import { toMetadataArguments } from './astToMetadataArgument';

function visitObjectField(typeName: string, field: FieldDefinitionNode): Metadata[]
{
  const directives = field.directives || [];
  const fieldName = field.name.value;

  console.log('visitObjectField: ', typeName, fieldName, JSON.stringify(field));

  return directives.map((directive) => {
    const args = directive.arguments || [];

    console.log('visitObjectField directive: ', typeName, fieldName, directive.name.value);

    return {
      typeName,
      fieldName,
      name: directive.name.value,
      location: MetadataLocation.OBJECT_FIELD,
      arguments: toMetadataArguments(args),
    };
  });
}

function visitObjectType(type: ObjectTypeDefinitionNode): Metadata[]
{
  const metadata: Metadata[] = [];
  const typeName = type.name.value;
  const directives = type.directives || [];

  console.log('visitObjectType: ', typeName);

  const typeMetadata = directives.map((directive) => {
    const args = directive.arguments || [];

    return {
      typeName,
      name: directive.name.value,
      location: MetadataLocation.OBJECT_TYPE,
      fieldName: null,
      arguments: toMetadataArguments(args)
    };
  });

  const fields = (type.fields || []);

  console.log('fields: ', fields);

  const fieldsMetadata = fields
    .reduce((result: Metadata[], field: FieldDefinitionNode) =>
    {
      const fieldResult = visitObjectField(typeName, field);

      console.log('fieldResult:', fieldResult);

      result.push(...fieldResult);

      return result;
    }, []); // tslint:disable-line: align

  console.log('fieldsMetadata: ', fieldsMetadata);

  metadata.push(...typeMetadata);
  metadata.push(...fieldsMetadata);

  return metadata;
}

function visitDocument(document: DocumentNode): Metadata[]
{
  const metadata: Metadata[] = [];

  const visitor = {
    // tslint:disable-next-line:function-name
    [Kind.OBJECT_TYPE_DEFINITION](type: ObjectTypeDefinitionNode)
    {
      const typeMetadata = visitObjectType(type);

      metadata.push(...typeMetadata);
    }
  };

  visit(document, visitor);

  console.log('metadata: ', metadata);

  return metadata;
}

export function collectMetadata(document: DocumentNode): Metadata[] {
  return visitDocument(document);
}
