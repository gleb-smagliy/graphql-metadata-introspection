import gql from 'graphql-tag';
import { toMetadataArguments } from '../src/astToMetadataArgument';

const testCases = [
  {
    input: '@key',
    output: [],
    should: 'return empty array when no args provided'
  },
  {
    input: '@key(arg1: "some_value")',
    output: [
      { name: 'arg1', value: JSON.stringify('some_value') }
    ],
    should: 'return single string-typed JSON.stringified argument'
  },
  {
    input: '@key(arg1: {field1: "value1"})',
    output: [
      { name: 'arg1', value: JSON.stringify({ field1: 'value1' }) }
    ],
    should: 'return single object-typed JSON.stringified argument'
  }
];

describe('makeExecutableSchema', () =>
{
  for(const testCase of testCases)
  {
    const { should, input, output } = testCase;

    it(`should ${should}`, () =>
    {
      const sdl = gql(`type User ${input} { id: ID! }`);

      const directiveArgs = sdl.definitions[0].directives[0].arguments;

      expect(toMetadataArguments(directiveArgs)).toEqual(output);
    });
  }
});
