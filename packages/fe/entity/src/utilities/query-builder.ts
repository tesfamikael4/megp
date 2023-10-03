import type { CollectionQuery, Where, Order, FilterOperator } from '../models/query'; // Import your types

// Function to encode a CollectionQuery object to a custom URL query string
export function encodeCollectionQuery(query: CollectionQuery): string {
  const queryParams: string[] = [];

  if (query.select) {
    queryParams.push(`s=${query.select.join(',')}`);
  }

  if (query.where) {
    queryParams.push(`w=${encodeWhere(query.where)}`);
  }

  if (query.take !== undefined) {
    queryParams.push(`t=${query.take}`);
  }

  if (query.skip !== undefined) {
    queryParams.push(`sk=${query.skip}`);
  }

  if (query.orderBy) {
    queryParams.push(`o=${encodeOrderBy(query.orderBy)}`);
  }

  if (query.includes) {
    queryParams.push(`i=${query.includes.join(',')}`);
  }

  if (query.groupBy) {
    queryParams.push(`g=${query.groupBy.join(',')}`);
  }

  if (query.having) {
    queryParams.push(`h=${encodeWhere(query.having)}`);
  }

  if (query.count) {
    queryParams.push(`c=true`);
  }

  return queryParams.join('&');
}

// Function to decode a custom URL query string into a CollectionQuery object
export function decodeCollectionQuery(queryString: string): CollectionQuery {
  const query: CollectionQuery = {};
  const queryParams = new URLSearchParams(queryString);

  if (queryParams.has('s')) {
    query.select = queryParams.get('s')!.split(',');
  }

  if (queryParams.has('w')) {
    query.where = decodeWhere(queryParams.get('w')!);
  }

  if (queryParams.has('t')) {
    query.take = parseInt(queryParams.get('t')!, 10);
  }

  if (queryParams.has('sk')) {
    query.skip = parseInt(queryParams.get('sk')!, 10);
  }

  if (queryParams.has('o')) {
    query.orderBy = decodeOrderBy(queryParams.get('o')!);
  }

  if (queryParams.has('i')) {
    query.includes = queryParams.get('i')!.split(',');
  }

  if (queryParams.has('g')) {
    query.groupBy = queryParams.get('g')!.split(',');
  }

  if (queryParams.has('h')) {
    query.having = decodeWhere(queryParams.get('h')!);
  }

  if (queryParams.has('c')) {
    query.count = queryParams.get('c') === 'true';
  }

  return query;
}

// Helper function to encode a Where array to a compact string
function encodeWhere(where: Where[][]): string {
  return where.map(encodeWhereGroup).join('|');
}

// Helper function to decode a compact string to a Where array
function decodeWhere(encoded: string): Where[][] {
  return encoded.split('|').map(decodeWhereGroup);
}

// Helper function to encode a Where group to a compact string
function encodeWhereGroup(group: Where[]): string {
  return group.map(encodeWhereItem).join(',');
}

// Helper function to decode a compact string to a Where group
function decodeWhereGroup(encoded: string): Where[] {
  return encoded.split(',').map(decodeWhereItem);
}

// Helper function to encode a Where item to a compact string
function encodeWhereItem(item: Where): string {
  return `${item.column}:${item.operator}:${item.value}`;
}

// Helper function to decode a compact string to a Where item
function decodeWhereItem(encoded: string): Where {
  const parts = encoded.split(':');
  return {
    column: parts[0],
    operator: parts[1] as FilterOperator,
    value: parts[2],
  };
}

// Helper function to encode an Order array to a compact string
function encodeOrderBy(orderBy: Order[]): string {
  return orderBy.map(encodeOrderItem).join(',');
}

// Helper function to decode a compact string to an Order array
function decodeOrderBy(encoded: string): Order[] {
  return encoded.split(',').map(decodeOrderItem);
}

// Helper function to encode an Order item to a compact string
function encodeOrderItem(item: Order): string {
  return `${item.column}:${item.direction || 'asc'}`;
}

// Helper function to decode a compact string to an Order item
function decodeOrderItem(encoded: string): Order {
  const parts = encoded.split(':');
  return {
    column: parts[0],
    direction: parts[1] as 'asc' | 'desc',
  };
}
