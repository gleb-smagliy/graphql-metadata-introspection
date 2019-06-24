import { execute } from 'graphql';
import gql from 'graphql-tag';
import { makeExecutableSchema } from '../src';

const typeDefs = `
      directive @ref(query: String, as: String) on FIELD_DEFINITION

      type User {
        id: ID! @ref(query: "fieldsByUserId", as: "")
      }

      type Query {
        me: User!
      }
      `;

const resolvers = {
  Query: {
    me: () => ({ id: 1 }),
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

describe('makeExecutableSchema', () =>
{
  it('should expose directive on object field', async () =>
  {
    const { data } = await execute(schema, gql`
      {
        me {
          id
        },
        meta: _metadata {
          name
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
    expect(data.meta[0]).toEqual(expect.anything());
    // @ts-ignore
    expect(data.meta[0]).toMatchObject({
      name: 'ref',
      typeName: 'User',
      fieldName: 'id',
      location: 'OBJECT_FIELD',
    });
  });
});
