export interface MetadataArgument {
    name: string;
    value: string;
}
export declare enum MetadataLocation {
    OBJECT_TYPE = "OBJECT_TYPE ",
    OBJECT_FIELD = "OBJECT_FIELD"
}
export interface Metadata {
    name: string;
    location: MetadataLocation;
    typeName: string;
    fieldName: string | null;
    arguments: MetadataArgument[];
}
//# sourceMappingURL=Metadata.d.ts.map