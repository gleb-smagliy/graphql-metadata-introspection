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

describe('makeExecutableSchema', () => 
{
  it.skip('should expose directive on object field', async () =>
  {
    const { data } = await execute(schema, gql`
      {
        me {
          id
        },
        meta: _metadata {
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

    expect(data).toEqual(expect.anything());
    // @ts-ignore
    expect(data.meta).toEqual(expect.anything());
    // @ts-ignore
    expect(data.meta).toMatchSnapshot({
      name: 'ref',
      typeName: 'User',
      fieldName: 'id',
      location: 'OBJECT_FIELD',
    });
  });
});
