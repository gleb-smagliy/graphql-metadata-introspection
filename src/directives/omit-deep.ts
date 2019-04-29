const omitDeep = (input: object, excludes: Array<number | string>): object =>
{
  return Object.entries(input).reduce((nextInput, [key, value]) =>
  {
    if (excludes.indexOf(key) !== -1)
    {
      return nextInput;
    }

    if (Array.isArray(value))
    {
      nextInput[key] = value.map((arrItem) =>
      {
        if (typeof arrItem === 'object')
        {
          return omitDeep(arrItem, excludes)
        }

        return arrItem;
      });

      return nextInput;
    }
    else if (typeof value === 'object')
    {
      nextInput[key] = omitDeep(value, excludes);

      return nextInput;
    }

    nextInput[key] = value;

    return nextInput;
  }, {});
};

export default omitDeep