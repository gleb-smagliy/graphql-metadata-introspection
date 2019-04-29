import omitDeep from '../src/directives/omit-deep';

describe('omitDeep', () =>
{
  it('should omit primitive values', () =>
  {
    const input = {
      someKey1: '123'
    };

    expect(omitDeep(input, ['someKey1'])).toEqual({});
  });

  it('should leave not specified fields', () =>
  {
    const input = {
      someKey1: '123',
      someKey2: '321'
    };

    expect(omitDeep(input, ['someKey1'])).toEqual({
      someKey2: '321'
    });
  });

  it('should leave not specified fields on the nested object', () =>
  {
    const input = {
      someKey1: '123',
      someKey2: {
        someKey1: '123',
        someKey2: { }
      }
    };

    expect(omitDeep(input, ['someKey1'])).toEqual({
      someKey2: {
        someKey2: { }
      }
    });
  });

  it('should leave not specified fields on the nested to array object', () =>
  {
    const input = {
      someKey1: '123',
      someKey2: [{
        someKey1: '123',
        someKey2: { }
      }]
    };

    expect(omitDeep(input, ['someKey1'])).toEqual({
      someKey2: [{
        someKey2: { }
      }]
    });
  });

  it('should exlude multiple keys', () =>
  {
    const input = {
      someKey1: '123',
      someKey3: '1456',
      someKey2: [{
        someKey1: '123',
        someKey2: { }
      }]
    };

    expect(omitDeep(input, ['someKey1', 'someKey3'])).toEqual({
      someKey2: [{
        someKey2: { }
      }]
    });
  });

  it('should exlude multiple keys on nested objects', () =>
  {
    const input = {
      someKey1: '123',
      someKey2: [{
        someKey1: '123',
        someKey3: '1456',
        someKey2: { }
      }]
    };

    expect(omitDeep(input, ['someKey1', 'someKey3'])).toEqual({
      someKey2: [{
        someKey2: { }
      }]
    });
  });

  it('should exlude key on objects within array but leave non-object items', () =>
  {
    const input = {
      someKey1: '123',
      someKey2: [1, {
        someKey1: '123',
        someKey3: '1456',
        someKey2: { }
      }]
    };

    expect(omitDeep(input, ['someKey1', 'someKey3'])).toEqual({
      someKey2: [1, {
        someKey2: { }
      }]
    });
  });
});