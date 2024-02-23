import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { CollectionQuery, Order, Where } from './query';
import { FilterOperators } from './filter_operators';
import { decodeCollectionQuery, encodeCollectionQuery } from './query-mapper';

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
  } else if (op === FilterOperators.NotIn && Array.isArray(value)) {
    // Handle "in" operator for the main ${aggregate}
    return `${queryCondition} Not IN (:...${queryParam})`;
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
    return `${queryCondition} LIKE(:${queryParam})`;
  } else if (op === FilterOperators.ILike) {
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
  } else if (op === FilterOperators.Like || op === FilterOperators.ILike) {
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

const applyWhereConditions = <T>(
  aggregate: string,
  queryBuilder: SelectQueryBuilder<T>,
  whereConditions: Where[][],
) => {
  for (const [index, conditions] of whereConditions.entries()) {
    const operator = index === 0 ? 'where' : 'andWhere';

    let count = 0;
    queryBuilder[operator]((subQuery) => {
      const orConditions = conditions.map(({ column, value, operator: op }) => {
        if (column.includes('.')) {
          const [relation, field] = column.split('.'); // Assuming "relation.field" format
          const fieldValue = `${field}_${++count}`;
          return addFilterConditions(
            op,
            value,
            `${relation}.${field}`,
            `${relation}_${fieldValue}`,
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
            const columnValue = `${column}_${++count}`;

            return addFilterConditions(
              op,
              value,
              `${aggregate}."${column}"`,
              columnValue,
            );
          }
        }
      });

      count = 0;
      const queryParams = conditions.reduce(
        (acc, { column, value, operator: op }) => {
          if (column.includes('.')) {
            const [relation, field] = column.split('.');
            const fieldValue = `${field}_${++count}`;
            acc = addFilterParams(op, value, `${relation}_${fieldValue}`, acc);
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
            const columnValue = `${column}_${++count}`;

            acc = addFilterParams(op, value, columnValue, acc);
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
};

const applyOrderBy = <T>(
  aggregate: string,
  queryBuilder: SelectQueryBuilder<T>,
  orderBy: Order[],
) => {
  orderBy.forEach(({ column, direction = 'ASC', nulls }) => {
    queryBuilder.addOrderBy(`${aggregate}.${column}`, direction, nulls);
  });
};

const applyIncludes = <T>(
  aggregate: string,
  queryBuilder: SelectQueryBuilder<T>,
  includes: string[],
) => {
  includes.forEach((relatedEntity) => {
    if (relatedEntity.includes('.')) {
      const [parent, child] = relatedEntity.split('.');
      queryBuilder.leftJoinAndSelect(`${parent}.${child}`, `${child}`);
    } else {
      queryBuilder.leftJoinAndSelect(
        `${aggregate}.${relatedEntity}`,
        relatedEntity,
      );
    }
  });
};

const applyGroupBy = <T>(
  aggregate: string,
  queryBuilder: SelectQueryBuilder<T>,
  groupBy: string[],
) => {
  groupBy.forEach((column) => {
    queryBuilder.addGroupBy(`${aggregate}.${column}`);
  });
};

const applyHaving = <T>(
  aggregate: string,
  queryBuilder: SelectQueryBuilder<T>,
  havingConditions: Where[][],
) => {
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
};

export const buildQuery = <T>(
  aggregate: string,
  queryBuilder: SelectQueryBuilder<T>,
  query: CollectionQuery,
) => {
  if (query.select && query.select.length > 0) {
    queryBuilder.select(query.select.map((column) => `${aggregate}.${column}`));
  }

  if (query.where && query.where.length > 0) {
    applyWhereConditions(aggregate, queryBuilder, query.where);
  }

  if (query.take) {
    queryBuilder.take(query.take);
  }

  if (query.skip) {
    queryBuilder.skip(query.skip);
  }

  if (query.orderBy && query.orderBy.length > 0) {
    applyOrderBy(aggregate, queryBuilder, query.orderBy);
  }

  if (query.includes && query.includes.length > 0) {
    applyIncludes(aggregate, queryBuilder, query.includes);
  }

  if (query.groupBy && query.groupBy.length > 0) {
    applyGroupBy(aggregate, queryBuilder, query.groupBy);
  }

  if (query.having && query.having.length > 0) {
    applyHaving(aggregate, queryBuilder, query.having);
  }

  // if (query.count) {
  //   queryBuilder.addSelect(`COUNT(${aggregate}.*)`, 'total');
  // }
};

export class QueryConstructor {
  static constructQuery<T extends ObjectLiteral>(
    repository: Repository<T>,
    query: CollectionQuery,
    withDelete = false,
  ): SelectQueryBuilder<T> {
    const aggregateColumns: any = {};
    const metaData = repository.manager.connection.getMetadata(
      repository.target,
    );
    metaData.columns.map((c) => {
      aggregateColumns[c.databasePath] = c.type;
    });

    const aggregate = metaData.tableName;
    const queryBuilder = repository.createQueryBuilder(aggregate);

    if (withDelete) {
      queryBuilder.withDeleted();
    }

    if (!metaData.propertiesMap['tenantId']) {
      query = this.removeFilter(query, 'tenantId');
    }

    if (!metaData.propertiesMap['organizationId']) {
      query = this.removeFilter(query, 'organizationId');
    }

    query = this.removeEmptyFilter(query);

    buildQuery(aggregate, queryBuilder, query);

    return queryBuilder;
  }
  static removeEmptyFilter(query: CollectionQuery) {
    query.where = query.where.filter((x) => x.length > 0);
    return query;
  }

  static removeFilter(query: CollectionQuery, key: string) {
    query.where = query.where.map((x) => {
      return x.filter((y) => y.column != key);
    });
    return query;
  }
}
