import exposeDirectives from '../src/directives/expose-directives';
import { gql } from 'apollo-server-lambda';
import { execute } from 'graphql';

const common = {
  types: `
    type Query {
      foo: Bar
    }
  `,
  resolvers: {
    Query: {
      foo: () => ({ name: 'bar' })
    }
  }
};

const schemas = {
  metadata: {
    types: gql`
      directive @metadata on FIELD_DEFINITION
    
      type Bar
      {
        lastName: String
        name: String @metadata
      }
      
      ${common.types}
    `,
    resolvers: common.resolvers
  },
  twoFieldsDirectives: {
    types: gql`
      directive @metadata on FIELD_DEFINITION
      directive @private on FIELD_DEFINITION
    
      type Bar
      {
        lastName: String
        name: String @metadata @private
      }
      
      ${common.types}
    `,
    resolvers: common.resolvers
  },
  ref: {
    types: gql`
      directive @ref(as: String, query: String!) on FIELD_DEFINITION
    
      type Bar
      {
        id: Int
        levelId: String @ref(as: "level", query: "levelById")
      }
      
      ${common.types}
    `,
    resolvers: common.resolvers
  },
  twoDirectives: {
    types: gql`
      directive @ref(as: String, query: String!) on FIELD_DEFINITION
    
      type Bar
      {
        id: Int @ref(query: "hello")
        levelId: String @ref(as: "level", query: "levelById")
      }
      
      ${common.types}
    `,
    resolvers: common.resolvers
  },
  typePrivateDirective: {
    types: gql`
      directive @private on OBJECT
    
      type Bar @private
      {
        id: Int
      }
      
      ${common.types}
    `,
    resolvers: common.resolvers
  },
  twoTypeDirectives: {
    types: gql`
      directive @private on OBJECT
      directive @pk(keys: [String]) on OBJECT
    
      type Bar @private @pk(keys: ["id", "secondId"])
      {
        id: Int
        secondId: Int
      }
      
      ${common.types}
    `,
    resolvers: common.resolvers
  }
};

describe('exposeDirectives', () =>
{
  it('should return name and typeName of the directive defined on the field', async () =>
  {
    const augmentedSchema = exposeDirectives({ typeDefs: [schemas.metadata.types], resolvers: schemas.metadata.resolvers });

    const fieldsDirectives = await execute({
      schema: augmentedSchema,
      document: gql`
        query {
          _fieldsDirectives {
            name
            typeName
          }
        }
      `
    });

    const { data: { _fieldsDirectives } } = fieldsDirectives;

    expect(_fieldsDirectives.length).toEqual(1);
    expect(_fieldsDirectives[0].name).toEqual('metadata');
    expect(_fieldsDirectives[0].typeName).toEqual('Bar');
  });

  it('should return stringified arguments of the directive defined on the field', async () =>
  {
    const augmentedSchema = exposeDirectives({ typeDefs: [schemas.ref.types], resolvers: schemas.ref.resolvers });

    const fieldsDirectives = await execute({
      schema: augmentedSchema,
      document: gql`
        query {
          _fieldsDirectives {
            arguments
          }
        }
      `
    });

    const { data: { _fieldsDirectives } } = fieldsDirectives;

    expect(_fieldsDirectives[0].arguments.length).toEqual(2);

    const asArg = _fieldsDirectives[0].arguments[0];
    const queryArg = _fieldsDirectives[0].arguments[1];

    expect(asArg.name.value).toEqual('as');
    expect(asArg.value.kind).toEqual('StringValue');
    expect(asArg.value.value).toEqual('level');

    expect(queryArg.name.value).toEqual('query');
    expect(queryArg.value.kind).toEqual('StringValue');
    expect(queryArg.value.value).toEqual('levelById');
  });

  it('should return multiple directives', async () =>
  {
    const augmentedSchema = exposeDirectives({ typeDefs: [schemas.ref.types], resolvers: schemas.ref.resolvers });

    const fieldsDirectives = await execute({
      schema: augmentedSchema,
      document: gql`
        query {
          _fieldsDirectives {
            arguments
          }
        }
      `
    });

    const { data: { _fieldsDirectives } } = fieldsDirectives;

    expect(_fieldsDirectives[0].arguments.length).toEqual(2);

    const asArg = _fieldsDirectives[0].arguments[0];
    const queryArg = _fieldsDirectives[0].arguments[1];

    expect(asArg.name.value).toEqual('as');
    expect(asArg.value.kind).toEqual('StringValue');
    expect(asArg.value.value).toEqual('level');

    expect(queryArg.name.value).toEqual('query');
    expect(queryArg.value.kind).toEqual('StringValue');
    expect(queryArg.value.value).toEqual('levelById');
  });

  it('should return multiple directives', async () =>
  {
    const augmentedSchema = exposeDirectives({ typeDefs: [schemas.twoDirectives.types], resolvers: schemas.ref.resolvers });

    const fieldsDirectives = await execute({
      schema: augmentedSchema,
      document: gql`
        query {
          _fieldsDirectives {
            name,
            fieldName
          }
        }
      `
    });

    const { data: { _fieldsDirectives } } = fieldsDirectives;

    expect(_fieldsDirectives.length).toEqual(2);
    expect(_fieldsDirectives.find(d => d.fieldName === 'id').name).toEqual('ref');
    expect(_fieldsDirectives.find(d => d.fieldName === 'levelId').name).toEqual('ref');
  });

  it('should return type directive', async () =>
  {
    const augmentedSchema = exposeDirectives({ typeDefs: [schemas.typePrivateDirective.types], resolvers: schemas.typePrivateDirective.resolvers });

    const fieldsDirectives = await execute({
      schema: augmentedSchema,
      document: gql`
        query {
          _typesDirectives {
            typeName,
            name
          }
        }
      `
    });

    const { data: { _typesDirectives } } = fieldsDirectives;

    expect(_typesDirectives.length).toEqual(1);
    expect(_typesDirectives[0].typeName).toEqual('Bar');
    expect(_typesDirectives[0].name).toEqual('private');
  });

  it('should return type directives defined on the same type', async () =>
  {
    const augmentedSchema = exposeDirectives({ typeDefs: [schemas.twoTypeDirectives.types], resolvers: schemas.twoTypeDirectives.resolvers });

    const fieldsDirectives = await execute({
      schema: augmentedSchema,
      document: gql`
        query {
          _typesDirectives {
            typeName,
            name
          }
        }
      `
    });

    const { data: { _typesDirectives } } = fieldsDirectives;

    expect(_typesDirectives.length).toEqual(2);
    expect(_typesDirectives.filter(d => d.typeName === 'Bar' && d.name === 'pk').length).toEqual(1);
    expect(_typesDirectives.filter(d => d.typeName === 'Bar' && d.name === 'private').length).toEqual(1);
  });

  it('should return type directives with args', async () =>
  {
    const augmentedSchema = exposeDirectives({ typeDefs: [schemas.twoTypeDirectives.types], resolvers: schemas.twoTypeDirectives.resolvers });

    const fieldsDirectives = await execute({
      schema: augmentedSchema,
      document: gql`
        query {
          _typesDirectives {
            typeName
            name
            arguments
          }
        }
      `
    });

    const { data: { _typesDirectives } } = fieldsDirectives;

    const directive = _typesDirectives.find(d => d.typeName === 'Bar' && d.name === 'pk');
    const keysArg = directive.arguments[0];

    expect(_typesDirectives.length).toEqual(2);
    expect(directive.arguments.length).toEqual(1);
    expect(keysArg.name.value).toEqual('keys');
    expect(keysArg.value.kind).toEqual('ListValue');
    expect(keysArg.value.values[0].value).toEqual('id');
    expect(keysArg.value.values[1].value).toEqual('secondId');
  });

  it('should return type directives with args', async () =>
  {
    const augmentedSchema = exposeDirectives({ typeDefs: [schemas.twoTypeDirectives.types], resolvers: schemas.twoTypeDirectives.resolvers });

    const fieldsDirectives = await execute({
      schema: augmentedSchema,
      document: gql`
        query {
          _typesDirectives {
            typeName
            name
            arguments
          }
        }
      `
    });

    const { data: { _typesDirectives } } = fieldsDirectives;

    const directive = _typesDirectives.find(d => d.typeName === 'Bar' && d.name === 'pk');
    const keysArg = directive.arguments[0];

    expect(_typesDirectives.length).toEqual(2);
    expect(directive.arguments.length).toEqual(1);
    expect(keysArg.name.value).toEqual('keys');
    expect(keysArg.value.kind).toEqual('ListValue');
    expect(keysArg.value.values[0].value).toEqual('id');
    expect(keysArg.value.values[1].value).toEqual('secondId');
  });

  it('should return two fields directives', async () =>
  {
    const augmentedSchema = exposeDirectives({ typeDefs: [schemas.twoFieldsDirectives.types], resolvers: schemas.twoFieldsDirectives.resolvers });

    const fieldsDirectives = await execute({
      schema: augmentedSchema,
      document: gql`
        query {
          _fieldsDirectives {
            typeName
            name
          }
        }
      `
    });

    const { data: { _fieldsDirectives } } = fieldsDirectives;

    expect(_fieldsDirectives.length).toEqual(2);
    expect(_fieldsDirectives.filter(d => d.name === 'private').length).toEqual(1);
    expect(_fieldsDirectives.filter(d => d.name === 'metadata').length).toEqual(1);
  });
});