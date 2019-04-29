import { gql } from 'apollo-server-lambda';

export const FIELDS_DIRECTIVES_QUERY_NAME = '_fieldsDirectives';
export const TYPES_DIRECTIVES_QUERY_NAME = '_typesDirectives';

export default gql`
  scalar DirectiveArgumentsJson

  type FieldDirective 
  {
    name: String!
    typeName: String! 
    fieldName: String
    arguments: DirectiveArgumentsJson    
  }
  
  type TypeDirective 
  {
    name: String!
    typeName: String!
    arguments: DirectiveArgumentsJson
  }

  type Query
  {
    ${FIELDS_DIRECTIVES_QUERY_NAME}: [FieldDirective]!
    ${TYPES_DIRECTIVES_QUERY_NAME}: [TypeDirective]!
  }
`;