
import { CollectionQuery, Where } from '../models/query';

export function encodeCollectionQuery(query: CollectionQuery): string {
  const params: string[] = [];

  // Helper function to add a key-value pair to the params array
  function addParam(key: string, value: any) {
    if (value !== undefined && value !== null) {
      params.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`,
      );
    }
  }

  // Select
  if (query.select && query.select.length > 0) {
    addParam('select', query.select.join(','));
  }

  // Where
  if (query.where && query.where.length > 0) {
    const whereParam = query.where
      .map((condition) => {
        if (condition && condition.length > 0) {
          return (
            '(' +
            condition
              .map((clause) => {
                return `${clause.column}${clause.operator ? clause.operator : '='
                  }${clause.value}`;
              })
              .join(' AND ') +
            ')'
          );
        }
        return '';
      })
      .filter((condition) => condition !== '')
      .join(' OR ');

    if (whereParam) {
      addParam('where', whereParam);
    }
  }

  // Take
  if (query.take) {
    addParam('take', query.take);
  }

  // Skip
  if (query.skip) {
    addParam('skip', query.skip);
  }

  // OrderBy
  if (query.orderBy && query.orderBy.length > 0) {
    const orderByParam = query.orderBy
      .map((order) => {
        return `${order.column}${order.direction ? `:${order.direction}` : ''}`;
      })
      .join(',');

    if (orderByParam) {
      addParam('orderBy', orderByParam);
    }
  }

  // Includes
  if (query.includes && query.includes.length > 0) {
    addParam('includes', query.includes.join(','));
  }

  // GroupBy
  if (query.groupBy && query.groupBy.length > 0) {
    addParam('groupBy', query.groupBy.join(','));
  }

  // Having
  if (query.having && query.having.length > 0) {
    const havingParam = query.having
      .map((condition) => {
        if (condition && condition.length > 0) {
          return (
            '(' +
            condition
              .map((clause) => {
                return `${clause.column}${clause.operator ? clause.operator : '='
                  }${clause.value}`;
              })
              .join(' AND ') +
            ')'
          );
        }
        return '';
      })
      .filter((condition) => condition !== '')
      .join(' OR ');

    if (havingParam) {
      addParam('having', havingParam);
    }
  }

  // Count
  if (query.count) {
    addParam('count', 'true');
  }

  return params.join('&');
}

export function decodeCollectionQuery(queryParam: string): CollectionQuery {
  const query: CollectionQuery = {};

  // Helper function to split a parameter string and create a condition array
  function createConditionArray(conditionString: string): Where[][] | undefined {
    return conditionString.split(' OR ').map((condition) => {
      return condition.split(' AND ').map((clause) => {
        const [column, operator, value] = clause.split(/(=|>|>=|<|<=|<>|!=|LIKE|ILIKE|~|~\*|IN|IS|IS DISTINCT FROM|@@|contains|<@|&&|&<|&>|-\|-|NOT|OR|AND|ALL|ANY)/);
        return {
          column: column.trim(), // Trim here to remove extra spaces
          operator: operator ? operator.trim() : undefined, // Trim here
          value: value.trim(), // Trim here
        } as Where;
      });
    });
  }

  const paramPairs = queryParam.split('&');
  for (const paramPair of paramPairs) {
    const [key, value] = paramPair.split('=');
    const decodedKey = decodeURIComponent(key);
    const decodedValue = decodeURIComponent(value);

    switch (decodedKey) {
      case 'select':
        query.select = decodedValue.split(',');
        break;
      case 'where':
        query.where = createConditionArray(decodedValue);
        break;
      case 'take':
        query.take = parseInt(decodedValue, 10);
        break;
      case 'skip':
        query.skip = parseInt(decodedValue, 10);
        break;
      case 'orderBy':
        query.orderBy = decodedValue.split(',').map((order) => {
          const [column, direction] = order.split(':');
          return {
            column: decodeURIComponent(column),
            direction: direction ? decodeURIComponent(direction) as ('asc' | 'desc') : undefined,
          };
        });
        break;
      case 'includes':
        query.includes = decodedValue.split(',');
        break;
      case 'groupBy':
        query.groupBy = decodedValue.split(',');
        break;
      case 'having':
        query.having = createConditionArray(decodedValue);
        break;
      case 'count':
        query.count = decodedValue === 'true';
        break;
      default:
        // Ignore unknown parameters
        break;
    }
  }

  return query;
}


