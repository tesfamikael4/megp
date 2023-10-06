import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { CollectionQueryNew, Order, Where } from './query'; // Import your models here
import { FilterOperators } from './filter_operators';

const addFilterConditions = (
  op: string,
  value: any,
  queryCondition: string,
  queryParam: string,
) => {
  if (
    op === FilterOperators.Between &&
    Array.isArray(value) &&
    value.length === 2
  ) {
    // Handle "between" operator for the main ${aggregate}
    return `${queryCondition} BETWEEN :${queryParam}_1 AND :${queryParam}_2`;
  } else if (op === FilterOperators.In && Array.isArray(value)) {
    // Handle "in" operator for the main ${aggregate}
    return `${queryCondition} IN (:...${queryParam})`;
  } else if (op === FilterOperators.IsNull) {
    // Handle "isNull" operator for the main ${aggregate}
    return `${queryCondition} IS NULL`;
  } else if (op === FilterOperators.IsNotNull) {
    // Handle "notNull" operator for the main ${aggregate}
    return `${queryCondition} IS NOT NULL`;
  } else if (op === FilterOperators.EqualTo) {
    return `${queryCondition} = :${queryParam}`;
  } else if (op === FilterOperators.GreaterThan) {
    return `${queryCondition} > :${queryParam}`;
  } else if (op === FilterOperators.LessThan) {
    return `${queryCondition} < :${queryParam}`;
  } else if (op === FilterOperators.LessThanOrEqualTo) {
    return `${queryCondition} <= :${queryParam}`;
  } else if (op === FilterOperators.GreaterThanOrEqualTo) {
    return `${queryCondition} >= :${queryParam}`;
  } else if (op === FilterOperators.NotEqualTo) {
    return `${queryCondition} != :${queryParam}`;
  } else if (op === FilterOperators.All) {
    return `${queryCondition} = ALL(:${queryParam})`;
  } else if (op === FilterOperators.Any) {
    return `${queryCondition} = ANY(:${queryParam})`;
  } else if (op === FilterOperators.Like) {
    return `${queryCondition} ILIKE(:${queryParam})`;
  } else if (op === FilterOperators.NotEqual) {
    return `${queryCondition} <> :${queryParam}`;
  } else {
    return `${queryCondition} ${op} :${queryParam}`;
  }
};

const addFilterParams = (op: string, value: any, column: string, acc: any) => {
  if (
    op === FilterOperators.Between &&
    Array.isArray(value) &&
    value.length === 2
  ) {
    // Handle "between" operator for the main ${aggregate}
    acc[`${column}_1`] = value[0];
    acc[`${column}_2`] = value[1];
  } else if (op === FilterOperators.In && Array.isArray(value)) {
    // Handle "in" operator for the main ${aggregate}
    acc[column] = value;
  } else if (op === FilterOperators.Like) {
    // Handle "in" operator for the main ${aggregate}
    acc[column] = `%${value}%`;
  } else if (op === FilterOperators.All || op === FilterOperators.Any) {
    // Handle "ALL" and "ANY" operators for the main ${aggregate}
    acc[column] = value;
  } else {
    acc[column] = value;
  }

  return acc;
};

function applyWhereConditions<T>(
  aggregate: string,
  queryBuilder: SelectQueryBuilder<T>,
  whereConditions: Where[][],
) {
  for (const [index, conditions] of whereConditions.entries()) {
    const operator = index === 0 ? 'where' : 'andWhere';

    queryBuilder[operator]((subQuery) => {
      const orConditions = conditions.map(({ column, value, operator: op }) => {
        if (column.includes('.')) {
          const [relation, field] = column.split('.'); // Assuming "relation.field" format
          return addFilterConditions(
            op,
            value,
            `${relation}.${field}`,
            `${relation}_${field}`,
          );
        } else {
          // Handle conditions for the main entity
          const [mainColumn, nestedColumn] = column.split('->>'); // Handle nested JSON columns like "json_column->>field"
          if (nestedColumn) {
            if (mainColumn.includes('->')) {
              const [main, path] = mainColumn.split('->');
              return addFilterConditions(
                op,
                value,
                `${aggregate}."${main}"->'${path}'->>'${path}'`,
                `${main}_${path}`,
              );
            } else {
              return addFilterConditions(
                op,
                value,
                `${aggregate}."${mainColumn}"->>'${nestedColumn}'`,
                `${mainColumn}_${nestedColumn}`,
              );
            }
          } else {
            return addFilterConditions(
              op,
              value,
              `${aggregate}."${column}"`,
              column,
            );
          }
        }
      });

      const queryParams = conditions.reduce(
        (acc, { column, value, operator: op }) => {
          if (column.includes('.')) {
            const [relation, field] = column.split('.');
            acc = addFilterParams(op, value, `${relation}_${field}`, acc);
          } else if (column.includes('->>')) {
            const [mainColumn, nestedColumn] = column.split('->>');
            if (mainColumn.includes('->')) {
              const [main, path] = mainColumn.split('->');
              acc = addFilterParams(op, value, `${main}_${path}`, acc);
            } else {
              acc = addFilterParams(
                op,
                value,
                `${mainColumn}_${nestedColumn}`,
                acc,
              );
            }
          } else {
            acc = addFilterParams(op, value, column, acc);
          }
          return acc;
        },
        {},
      );

      if (orConditions) {
        subQuery.andWhere(`(${orConditions.join(' OR ')})`, queryParams);
      }
    });

    queryBuilder.expressionMap.wheres =
      queryBuilder.expressionMap.wheres.filter((f) => f.condition);
  }
}

function applyOrderBy<T>(
  aggregate: string,
  queryBuilder: SelectQueryBuilder<T>,
  orderBy: Order[],
) {
  orderBy.forEach(({ column, direction = 'ASC', nulls }) => {
    queryBuilder.addOrderBy(`${aggregate}.${column}`, direction, nulls);
  });
}

function applyIncludes<T>(
  aggregate: string,
  queryBuilder: SelectQueryBuilder<T>,
  includes: string[],
) {
  includes.forEach((relatedEntity) => {
    queryBuilder.leftJoinAndSelect(
      `${aggregate}.${relatedEntity}`,
      relatedEntity,
    );
  });
}

function applyGroupBy<T>(
  aggregate: string,
  queryBuilder: SelectQueryBuilder<T>,
  groupBy: string[],
) {
  groupBy.forEach((column) => {
    queryBuilder.addGroupBy(`${aggregate}.${column}`);
  });
}

function applyHaving<T>(
  aggregate: string,
  queryBuilder: SelectQueryBuilder<T>,
  havingConditions: Where[][],
) {
  for (const conditions of havingConditions) {
    const orConditions = conditions.map(({ column, value, operator: op }) => {
      if (
        op === FilterOperators.Between &&
        Array.isArray(value) &&
        value.length === 2
      ) {
        // Handle "between" operator for the main ${aggregate}
        return `COUNT(${aggregate}.*) BETWEEN :${column}_1 AND :${column}_2`;
      } else if (op === FilterOperators.In && Array.isArray(value)) {
        // Handle "in" operator for the main ${aggregate}
        return `COUNT(${aggregate}.*) IN (:...${column})`;
      } else if (op === FilterOperators.Like) {
        // Handle "like" operator for the main ${aggregate}
        return `COUNT(${aggregate}.*) LIKE :${column}`;
      } else if (op === FilterOperators.All || op === FilterOperators.Any) {
        // Handle "ALL" and "ANY" operators for the main ${aggregate}
        return `COUNT(${aggregate}.${column}) ${op} :${column}`;
      } else {
        return `COUNT(${aggregate}.${column}) ${op} :${column}`;
      }
    });

    const queryParams = conditions.reduce(
      (acc, { column, value, operator: op }) => {
        if (
          op === FilterOperators.Between &&
          Array.isArray(value) &&
          value.length === 2
        ) {
          // Handle "between" operator for the main ${aggregate}
          acc[`${column}_1`] = value[0];
          acc[`${column}_2`] = value[1];
        } else if (op === FilterOperators.In && Array.isArray(value)) {
          // Handle "in" operator for the main ${aggregate}
          acc[column] = value;
        } else if (op === FilterOperators.Like) {
          // Handle "like" operator for the main ${aggregate}
          acc[column] = `%${value}%`;
        } else if (op === FilterOperators.All || op === FilterOperators.Any) {
          // Handle "ALL" and "ANY" operators for the main ${aggregate}
          acc[column] = value;
        } else {
          acc[column] = value;
        }
        return acc;
      },
      {},
    );

    if (orConditions.length > 0) {
      queryBuilder.andHaving(`(${orConditions.join(' OR ')})`, queryParams);
    }
  }
}

export function buildQuery<T>(
  aggregate: string,
  queryBuilder: SelectQueryBuilder<T>,
  query: CollectionQueryNew,
) {
  if (query.select) {
    queryBuilder.select(query.select.map((column) => `${aggregate}.${column}`));
  }

  if (query.where) {
    applyWhereConditions(aggregate, queryBuilder, query.where);
  }

  if (query.take) {
    queryBuilder.take(query.take);
  }

  if (query.skip) {
    queryBuilder.skip(query.skip);
  }

  if (query.orderBy) {
    applyOrderBy(aggregate, queryBuilder, query.orderBy);
  }

  if (query.includes) {
    applyIncludes(aggregate, queryBuilder, query.includes);
  }

  if (query.groupBy) {
    applyGroupBy(aggregate, queryBuilder, query.groupBy);
  }

  if (query.having) {
    applyHaving(aggregate, queryBuilder, query.having);
  }

  // if (query.count) {
  //   queryBuilder.addSelect(`COUNT(${aggregate}.*)`, 'total');
  // }
}

export class QueryConstructorNew {
  static constructQuery<T extends ObjectLiteral>(
    repository: Repository<T>,
    queryN: CollectionQueryNew,
  ): SelectQueryBuilder<T> {
    const query: CollectionQueryNew = {
      // select: ['name'],
      where: [
        // [{ column: 'name', value: 'string', operator: '=' }, { column: 'name', value: 'string1', operator: '=' }],
        // [{ column: 'name', value: ['string', 'string1'], operator: 'IN' }],
        [{ column: 'name', value: 'string', operator: '<>' }],
        // [{ column: 'descriptionJson->>value', value: 20, operator: '!=' }],
        // [{ column: 'descriptionJson->value->>value', value: 20, operator: '=' }],
        // [
        //   {
        //     column: 'userGroups.userId',
        //     value: '1cfafb58-c068-4936-b284-fc4887045e1b',
        //     operator: '=',
        //   },
        //   {
        //     column: 'id',
        //     value: '33dc77cd-d987-4e18-8145-8a5a943210a6',
        //     operator: '=',
        //   },
        // ],
      ],
      take: 10,
      skip: 0,
      // orderBy: [{ column: 'name', direction: 'ASC' }],
      includes: ['userGroups'],
      // groupBy: ['name', 'id'],
      // having: [[{ column: 'name', value: 1, operator: '>' }]],
      count: true,
    };

    const aggregateColumns: any = {};
    const metaData = repository.manager.connection.getMetadata(
      repository.target,
    );
    metaData.columns.map((c) => {
      aggregateColumns[c.databasePath] = c.type;
    });

    const aggregate = metaData.tableName;
    const queryBuilder = repository.createQueryBuilder(aggregate);
    // Usage
    buildQuery(aggregate, queryBuilder, query);
    // const result = await queryBuilder.getRawAndEntities();

    const q = queryBuilder.getSql();

    return queryBuilder;
  }
}
