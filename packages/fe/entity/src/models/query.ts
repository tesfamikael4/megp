

export interface CollectionQuery {
    // horizontal filtering like selecting only certain columns
    select?: string[];

    // outer array  'and' inner array 'or'
    where?: Where[][];

    /** Sets maximal number of entities to take */
    take?: number;
    /** Sets number of entities to skip.  */
    skip?: number;

    orderBy?: Order[];

    /** 
     * this is foreign key relationship one to many, many to many or one to one
     * eg user has many roles, user has one profile, user has many permissions
     * and lets say we want to get all the roles, profile and permissions for a user
     * we can use includes to get all the related data 
     * by using the foreign key relationship
     */

    includes?: string[];

    groupBy?: string[];
    // outer array  'and' inner array 'or'
    having?: Where[][];

    /** 
     * if true: returns the total number of records that match the query not the data.
     */
    count?: boolean;
}

export interface Order {
    column: string;
    direction?: 'asc' | 'desc';
    nulls?: 'nullsFirst' | 'nullsLast';
}

export interface Where {
    column: string;
    value: any;
    operator: FilterOperator;

}

// https://postgrest.org/en/stable/references/api/tables_views.html#operators

type FilterOperator =
    | "="
    | ">"
    | ">="
    | "<"
    | "<="
    | "<>"
    | "!="
    | "LIKE"
    | "ILIKE"
    | "~"
    | "~*"
    | "IN"
    | "IS"
    | "IS DISTINCT FROM"
    | "@@"
    | "contains"
    | "<@"
    | "&&"
    | "&<"
    | "&>"
    | "-|-"
    | "NOT"
    | "OR"
    | "AND"
    | "ALL"
    | "ANY";




export interface CollectionResult<T> {
    total: number;
    items: T[];
}




const collectionQuery: CollectionQuery = {
    select: ['id', 'name', 'age'],
    where: [
        // AND condition 1
        [
            { column: 'age', value: 25, operator: '>' },
            { column: 'name', value: 'John', operator: 'LIKE' },
        ],
        // OR condition 1
        [
            { column: 'city', value: 'New York', operator: '=' },
            { column: 'city', value: 'San Francisco', operator: '=' },
        ],
    ],
    take: 10,
    skip: 0,
    orderBy: [
        { column: 'age', direction: 'asc' },
        { column: 'name', direction: 'desc' },
    ],
    includes: ['roles', 'profile', 'permissions'],
    groupBy: ['department'],
    having: [
        // AND condition 2
        [
            { column: 'COUNT(*)', value: 3, operator: '=' },
            { column: 'SUM(salary)', value: 100000, operator: '>' },
        ],
    ],
    count: true,
};


