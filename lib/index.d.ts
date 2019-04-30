import { GraphQLSchema } from 'graphql';
import { IExecutableSchemaDefinition } from 'graphql-tools';
export interface MetadataOptions {
    metadataName: string;
}
export declare function makeExecutableSchema<T = any>(schemaDefinition: IExecutableSchemaDefinition<T>, options?: MetadataOptions): GraphQLSchema;
//# sourceMappingURL=index.d.ts.map