import { execute } from 'graphql';
import gql from 'graphql-tag';
import { makeExecutableSchema } from '../src';

const schema = makeExecutableSchema({
  typeDefs: `
      directive @ref(query: String, as: String) on FIELD_DEFINITION

      type User {
        id: ID! @ref(query: "fieldsByUserId", as: "")
      }

      type Query {
        me: User!
      }
      `,
  resolvers: {
    Query: {
      me: () => ({ id: 1 }),
    },
  },
});

describe('makeExecutableSchema', () => {
  it('should', async () => {
    const result = await execute(schema, gql`
      {
        me {
          id
        },
        _metadata {
          arguments {
            name
            value
          }
          fieldName
          typeName
          location
        }
      }
    `);

    console.log('result:', JSON.stringify(result));
  });
});
