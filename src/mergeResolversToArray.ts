import { IResolvers } from 'graphql-tools';

type IAnyResolvers = IResolvers<any, any> | IResolvers<any, any>[] | undefined;

const resolversToArray = (resolver: IAnyResolvers): IResolvers<any, any>[] =>
{
  if (resolver === undefined)
  {
    return [];
  }

  if (Array.isArray(resolver))
  {
    return resolver;
  }

  return [resolver];
};

export function mergeResolversToArray(
  leftResolvers: IAnyResolvers,
  rightResolvers: IAnyResolvers
): IResolvers<any, any>[] | undefined
{
  if (leftResolvers === undefined && rightResolvers === undefined)
  {
    return undefined;
  }

  if (leftResolvers !== undefined && rightResolvers === undefined)
  {
    return resolversToArray(leftResolvers);
  }

  if (leftResolvers === undefined && rightResolvers !== undefined)
  {
    return resolversToArray(rightResolvers);
  }

  return [
    ...resolversToArray(leftResolvers),
    ...resolversToArray(rightResolvers)
  ];
}
