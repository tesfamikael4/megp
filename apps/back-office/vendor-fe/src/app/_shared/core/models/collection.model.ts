export interface CollectionQuery {
  search?: string;
  searchFrom?: string[];
  skip?: number;
  top?: number;
  index?: number;
  orderBy?: Order[];
  groupBy?: string[];
  // outer array  'and' inner array 'or'
  filter?: Filter[][];
  select?: string[];
  count?: boolean;
  locale?: string;
  includes?: string[];
}

export interface DetailQuery {
  filter?: Filter[][];
  select?: string[];
  locale?: string;
}
export interface Order {
  field: string;
  direction?: 'asc' | 'desc';
}

export interface Filter {
  field: string;

  value: any;
  operator?: string;
  name?: string;
}
export interface Collection<T> {
  [x: string]: any;
  total: number;
  items: T[];
}

export interface CollectionResult<T> {
  total: number;
  collectionQuery?: CollectionQuery;
  items: T[];
  isLoading: boolean;

  error?: any;
}
