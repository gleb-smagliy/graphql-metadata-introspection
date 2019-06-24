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
  },
  {
    input: '@key(arg1: true)',
    output: [
      { name: 'arg1', value: JSON.stringify(true) }
    ],
    should: 'return single boolean-typed JSON.stringified argument'
  },
  {
    input: '@key(arg1: 123)',
    output: [
      { name: 'arg1', value: JSON.stringify(123) }
    ],
    should: 'return single int-typed JSON.stringified argument'
  },
  {
    input: '@key(arg1: true, arg2: 123, arg3: 321.123)',
    output: [
      { name: 'arg1', value: JSON.stringify(true) },
      { name: 'arg2', value: JSON.stringify(123) },
      { name: 'arg3', value: JSON.stringify(321.123) }
    ],
    should: 'return many mix-typed JSON.stringified arguments'
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
