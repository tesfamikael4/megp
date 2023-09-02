export declare class CollectionQuery {
    top?: number;
    skip?: number;
    orderBy?: Order[];
    search?: string;
    searchFrom?: string[];
    filter?: Filter[][];
    includes?: string[];
    select?: string[];
    locale?: string;
    groupBy?: string[];
    count?: boolean;
}
export declare class Order {
    field?: string;
    direction?: string;
}
export declare class Filter {
    field: string;
    value?: any;
    operator?: string;
}
