// import { Metadata, MetadataArgument, MetadataLocation } from './Metadata';
// import {
//   ArgumentNode,
//   ASTKindToNode,
//   BooleanValueNode,
//   DocumentNode,
//   Kind, ObjectFieldNode,
//   ObjectTypeDefinitionNode, StringValueNode,
//   ValueNode,
//   Visitor
// } from 'graphql';
//
//
// function visitTypeDefinition(type: ObjectTypeDefinitionNode): Metadata[]
// {
//   const metadata: Metadata[] = [];
//
//   const typeMetadata = type.directives.map(directive => ({
//     location: MetadataLocation.OBJECT_TYPE,
//     typeName: type.name.value,
//     fieldName: null,
//     arguments: toMetadataArguments(directive.arguments)
//   }));
// }
//
// function visitAst(): Metadata[]
// {
//   const metadata: Metadata[] = [];
//
//   const visitor = {
//     // tslint:disable-next-line:function-name
//     [Kind.OBJECT_TYPE_DEFINITION](type: ObjectTypeDefinitionNode)
//     {
//       const typeMetadata = visitTypeDefinition(type);
//
//       metadata.push(...typeMetadata);
//     }
//   };
//
//   return metadata;
// }
//
// export function collectMetadata(typeDefs: DocumentNode): Metadata[] {
//
// }
