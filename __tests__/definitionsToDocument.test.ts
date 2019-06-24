import { print, parse } from 'graphql';
import { definitionsToDocument } from '../src/definitionsToDocument';

const testCases = [
  {
    input: ['type User { id: ID! }'],
    output: 'type User { id: ID! }',
    should: 'return parsed DocumentNode when passed single sdl string'
  },
  {
    input: [parse('type User { id: ID! }')],
    output: 'type User { id: ID! }',
    should: 'return sdl as passed when passed single DocumentNode'
  }
];

const normalize = (input: string) : string =>
  input
    .replace(/[\s|$]/g, '')

describe('definitionsToDocument', () =>
{
  for (const testCase of testCases)
  {
    const { input, output, should } = testCase;

    it(`should ${should}`, () =>
    {
      const actual = normalize(print(definitionsToDocument(input)));
      const expected = normalize(output);

      expect(actual).toEqual(expected);
    });
  }
});
