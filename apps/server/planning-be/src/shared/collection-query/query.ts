export interface CollectionQueryNew {
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
  direction?: 'ASC' | 'DESC';
  nulls?: 'NULLS FIRST' | 'NULLS LAST';
}

export interface Where {
  column: string;
  value: any;
  operator: FilterOperator;
}

// https://postgrest.org/en/stable/references/api/tables_views.html#operators

export type FilterOperator =
  | '='
  | '>'
  | '>='
  | '<'
  | '<='
  | '<>'
  | '!='
  | 'LIKE'
  | 'ILIKE'
  | '~'
  | '~*'
  | 'IN'
  | 'IS'
  | 'IS DISTINCT FROM'
  | '@@'
  | 'contains'
  | '<@'
  | '&&'
  | '&<'
  | '&>'
  | '-|-'
  | 'NOT'
  | 'OR'
  | 'AND'
  | 'ALL'
  | 'ANY'
  | 'BETWEEN';

export interface CollectionResult<T> {
  total: number;
  items: T[];
}
