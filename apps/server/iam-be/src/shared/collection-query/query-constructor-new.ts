import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { CollectionQueryNew, Order, Where } from './query'; // Import your models here
import { FilterOperators } from './filter_operators';

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
          // Handle conditions for related entities (child tables)
          const [relation, field] = column.split('.'); // Assuming "relation.field" format
          // subQuery.leftJoinAndSelect(`${aggregate}.${relation}`, relation);
          if (
            op === FilterOperators.Between &&
            Array.isArray(value) &&
            value.length === 2
          ) {
            // Handle "between" operator
            return `${relation}.${field} BETWEEN :${relation}_${field}_1 AND :${relation}_${field}_2`;
          } else if (op === FilterOperators.In && Array.isArray(value)) {
            // Handle "in" operator
            return `${relation}.${field} IN (:...${relation}_${field})`;
          } else if (op === FilterOperators.IsNull) {
            // Handle "isNull" operator
            return `${relation}.${field} IS NULL`;
          } else if (op === FilterOperators.IsNotNull) {
            // Handle "notNull" operator
            return `${relation}.${field} IS NOT NULL`;
          } else if (op === FilterOperators.EqualTo) {
            return `${relation}.${field} = :${relation}_${field}`;
          } else if (op === FilterOperators.GreaterThan) {
            return `${relation}.${field} > :${relation}_${field}`;
          } else if (op === FilterOperators.LessThan) {
            return `${relation}.${field} < :${relation}_${field}`;
          } else if (op === FilterOperators.LessThanOrEqualTo) {
            return `${relation}.${field} <= :${relation}_${field}`;
          } else if (op === FilterOperators.GreaterThanOrEqualTo) {
            return `${relation}.${field} >= :${relation}_${field}`;
          } else if (op === FilterOperators.NotEqualTo) {
            return `${relation}.${field} != :${relation}_${field}`;
          } else if (op === FilterOperators.All) {
            return `${relation}.${field} = ALL(:${relation}_${field})`;
          } else if (op === FilterOperators.Any) {
            return `${relation}.${field} = ANY(:${relation}_${field})`;
          } else if (op === FilterOperators.Like) {
            return `${relation}.${field} = ILIKE(:${relation}_${field})`;
          } else if (op === FilterOperators.NotEqual) {
            return `${relation}.${field} <> :${relation}_${field}`;
          } else {
            return `${relation}.${field} ${op} :${relation}_${field}`;
          }
        } else {
          // Handle conditions for the main entity
          const [mainColumn, nestedColumn] = column.split('->>'); // Handle nested JSON columns like "json_column->>field"
          if (nestedColumn) {
            if (mainColumn.includes('->')) {
              // Handle nested JSON objects like "json_column->>object->>field"
              const [main, path] = mainColumn.split('->');
              if (
                op === FilterOperators.Between &&
                Array.isArray(value) &&
                value.length === 2
              ) {
                // Handle "between" operator
                return `${aggregate}."${main}"->'${path}'->>'${path}'_1 BETWEEN :${path}->>${path}_2`;
              } else if (op === FilterOperators.In && Array.isArray(value)) {
                // Handle "in" operator
                return `${aggregate}."${main}"->'${path}'->>'${path}' IN (:...${path}_${path})`;
              } else if (op === FilterOperators.IsNull) {
                // Handle "isNull" operator
                return `${aggregate}."${main}"->'${path}'->>'${path}' IS NULL`;
              } else if (op === FilterOperators.IsNotNull) {
                // Handle "notNull" operator
                return `${aggregate}."${main}"->'${path}'->>'${path}' IS NOT NULL`;
              } else if (op === FilterOperators.EqualTo) {
                return `${aggregate}."${main}"->'${path}'->>'${path}' = :${main}_${path}`;
              } else if (op === FilterOperators.GreaterThan) {
                return `${aggregate}."${main}"->'${path}'->>'${path}' > :${main}_${path}`;
              } else if (op === FilterOperators.LessThan) {
                return `${aggregate}."${main}"->'${path}'->>'${path}' < :${main}_${path}`;
              } else if (op === FilterOperators.LessThanOrEqualTo) {
                return `${aggregate}."${main}"->'${path}'->>'${path}' <= :${main}_${path}`;
              } else if (op === FilterOperators.GreaterThanOrEqualTo) {
                return `${aggregate}."${main}"->'${path}'->>'${path}' >= :${main}_${path}`;
              } else if (op === FilterOperators.NotEqualTo) {
                return `${aggregate}."${main}"->'${path}'->>'${path}' != :${main}_${path}`;
              } else if (op === FilterOperators.All) {
                return `${aggregate}."${main}"->'${path}'->>'${path}' = ALL(:${main}_${path})`;
              } else if (op === FilterOperators.Any) {
                return `${aggregate}."${main}"->'${path}'->>'${path}' = ANY(:${main}_${path})`;
              } else if (op === FilterOperators.NotEqual) {
                return `${aggregate}."${main}"->'${path}'->>'${path}' <> :${main}_${path}`;
              } else {
                return `${aggregate}."${main}"->'${path}'->>'${path}'`;
              }
            } else {
              // Handle JSON arrays like "json_column->>array_field"
              if (
                op === FilterOperators.Between &&
                Array.isArray(value) &&
                value.length === 2
              ) {
                // Handle "between" operator for JSON arrays
                return `${aggregate}."${mainColumn}"->> :${nestedColumn}_1 BETWEEN :${nestedColumn}_2`;
              } else if (op === FilterOperators.In && Array.isArray(value)) {
                // Handle "in" operator for JSON arrays
                return `${aggregate}."${mainColumn}"->> :${nestedColumn} IN (:...${mainColumn}_${nestedColumn})`;
              } else if (op === FilterOperators.IsNull) {
                // Handle "isNull" operator for JSON arrays
                return `${aggregate}."${mainColumn}"->>'${nestedColumn}' :${mainColumn}_${nestedColumn} IS NULL`;
              } else if (op === FilterOperators.IsNotNull) {
                // Handle "notNull" operator for JSON arrays
                return `${aggregate}."${mainColumn}"->>'${nestedColumn}' :${mainColumn}_${nestedColumn} IS NOT NULL`;
              } else if (op === FilterOperators.EqualTo) {
                return `${aggregate}."${mainColumn}"->>'${nestedColumn}' = :${mainColumn}_${nestedColumn}`;
              } else if (op === FilterOperators.GreaterThan) {
                return `${aggregate}."${mainColumn}"->>'${nestedColumn}' > :${mainColumn}_${nestedColumn}`;
              } else if (op === FilterOperators.LessThan) {
                return `${aggregate}."${mainColumn}"->>'${nestedColumn}' < :${mainColumn}_${nestedColumn}`;
              } else if (op === FilterOperators.LessThanOrEqualTo) {
                return `${aggregate}."${mainColumn}"->>'${nestedColumn}' <= :${mainColumn}_${nestedColumn}`;
              } else if (op === FilterOperators.GreaterThanOrEqualTo) {
                return `${aggregate}."${mainColumn}"->>'${nestedColumn}' >= :${mainColumn}_${nestedColumn}`;
              } else if (op === FilterOperators.NotEqualTo) {
                return `${aggregate}."${mainColumn}"->>'${nestedColumn}' != :${mainColumn}_${nestedColumn}`;
              } else if (op === FilterOperators.All) {
                return `${aggregate}."${mainColumn}"->>'${nestedColumn}' = ALL(:${mainColumn}_${nestedColumn})`;
              } else if (op === FilterOperators.Any) {
                return `${aggregate}."${mainColumn}"->>'${nestedColumn}' = ANY(:${mainColumn}_${nestedColumn})`;
              } else if (op === FilterOperators.Like) {
                return `${aggregate}."${mainColumn}"->>'${nestedColumn}' ILIKE(:${mainColumn}_${nestedColumn})`;
              } else if (op === FilterOperators.NotEqual) {
                return `${aggregate}."${mainColumn}"->>'${nestedColumn}' <> :${mainColumn}_${nestedColumn}`;
              } else {
                return `${aggregate}."${mainColumn}"->>'${nestedColumn}' = :${mainColumn}_${nestedColumn}`;
              }
            }
          } else {
            if (
              op === FilterOperators.Between &&
              Array.isArray(value) &&
              value.length === 2
            ) {
              // Handle "between" operator for the main ${aggregate}
              return `${aggregate}.${column} BETWEEN :${column}_1 AND :${column}_2`;
            } else if (op === FilterOperators.In && Array.isArray(value)) {
              // Handle "in" operator for the main ${aggregate}
              return `${aggregate}.${column} IN (:...${column})`;
            } else if (op === FilterOperators.IsNull) {
              // Handle "isNull" operator for the main ${aggregate}
              return `${aggregate}.${column} IS NULL`;
            } else if (op === FilterOperators.IsNotNull) {
              // Handle "notNull" operator for the main ${aggregate}
              return `${aggregate}.${column} IS NOT NULL`;
            } else if (op === FilterOperators.EqualTo) {
              return `${aggregate}.${column} = :${column}`;
            } else if (op === FilterOperators.GreaterThan) {
              return `${aggregate}.${column} > :${column}`;
            } else if (op === FilterOperators.LessThan) {
              return `${aggregate}.${column} < :${column}`;
            } else if (op === FilterOperators.LessThanOrEqualTo) {
              return `${aggregate}.${column} <= :${column}`;
            } else if (op === FilterOperators.GreaterThanOrEqualTo) {
              return `${aggregate}.${column} >= :${column}`;
            } else if (op === FilterOperators.NotEqualTo) {
              return `${aggregate}.${column} != :${column}`;
            } else if (op === FilterOperators.All) {
              return `${aggregate}.${column} = ALL(:${column})`;
            } else if (op === FilterOperators.Any) {
              return `${aggregate}.${column} = ANY(:${column})`;
            } else if (op === FilterOperators.Like) {
              return `${aggregate}.${column} ILIKE(:${column})`;
            } else if (op === FilterOperators.NotEqual) {
              return `${aggregate}.${column} <> :${column}`;
            } else {
              return `${aggregate}."${column}" ${op} :${column}`;
            }
          }
        }
      });

      const queryParams = conditions.reduce(
        (acc, { column, value, operator: op }) => {
          if (column.includes('.')) {
            // Handle related ${aggregate} conditions
            const [relation, field] = column.split('.');
            if (
              op === FilterOperators.Between &&
              Array.isArray(value) &&
              value.length === 2
            ) {
              // Handle "between" operator for related entities
              acc[`${relation}_${field}_1`] = value[0];
              acc[`${relation}_${field}_2`] = value[1];
            } else if (op === FilterOperators.In && Array.isArray(value)) {
              // Handle "in" operator for related entities
              acc[`${relation}_${field}`] = value;
            } else if (
              op === FilterOperators.All ||
              op === FilterOperators.Any
            ) {
              // Handle "ALL" and "ANY" operators for related entities
              acc[`${relation}_${field}`] = value;
            } else {
              acc[`${relation}_${field}`] = value;
            }
          } else if (column.includes('->>')) {
            const [mainColumn, nestedColumn] = column.split('->>');
            if (mainColumn.includes('->')) {
              const [main, path] = mainColumn.split('->');

              if (
                op === FilterOperators.Between &&
                Array.isArray(value) &&
                value.length === 2
              ) {
                // Handle "between" operator for related entities
                acc[`${main}_${path}_1`] = value[0];
                acc[`${main}_${path}_2`] = value[1];
              } else if (op === FilterOperators.In && Array.isArray(value)) {
                // Handle "in" operator for related entities
                acc[`${main}_${path}`] = value;
              } else if (
                op === FilterOperators.All ||
                op === FilterOperators.Any
              ) {
                // Handle "ALL" and "ANY" operators for related entities
                acc[`${main}_${path}`] = value;
              } else if (op === FilterOperators.Like) {
                // Handle "in" operator for the main ${aggregate}
                acc[`${main}_${path}`] = `%${value}%`;
              } else {
                acc[`${main}_${path}`] = value;
              }
            } else {
              if (
                op === FilterOperators.Between &&
                Array.isArray(value) &&
                value.length === 2
              ) {
                // Handle "between" operator for related entities
                acc[`${mainColumn}_${nestedColumn}_1`] = value[0];
                acc[`${mainColumn}_${nestedColumn}_2`] = value[1];
              } else if (op === FilterOperators.In && Array.isArray(value)) {
                // Handle "in" operator for related entities
                acc[`${mainColumn}_${nestedColumn}`] = value;
              } else if (
                op === FilterOperators.All ||
                op === FilterOperators.Any
              ) {
                // Handle "ALL" and "ANY" operators for related entities
                acc[`${mainColumn}_${nestedColumn}`] = value;
              } else if (op === FilterOperators.Like) {
                // Handle "in" operator for the main ${aggregate}
                acc[`${mainColumn}_${nestedColumn}`] = `%${value}%`;
              } else {
                acc[`${mainColumn}_${nestedColumn}`] = value;
              }
            }
          } else {
            // Handle conditions for the main ${aggregate}
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
            } else if (
              op === FilterOperators.All ||
              op === FilterOperators.Any
            ) {
              // Handle "ALL" and "ANY" operators for the main ${aggregate}
              acc[column] = value;
            } else {
              acc[column] = value;
            }
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
        // [{ column: 'name', value: ['string', 'string1'], operator: 'ANY' }],
        // [{ column: 'name', value: ['string', 'string1'], operator: 'ANY' }],
        // [{ column: 'descriptionJson->>value', value: 20, operator: '=' }],
        // [{ column: 'descriptionJson->value->>value', value: 20, operator: '=' }],
        // [
        //   {
        //     column: 'userGroups.userId',
        //     value: '1cfafb58-c068-4936-b284-fc4887045e1b',
        //     operator: '=',
        //   },
        // ],
      ],
      take: 10,
      skip: 0,
      // orderBy: [{ column: 'name', direction: 'ASC' }],
      // includes: ['userGroups'],
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
