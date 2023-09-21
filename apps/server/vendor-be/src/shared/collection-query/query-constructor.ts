import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { FilterOperators } from './filter_operators';
import { CollectionQuery } from './collection-query';

export class QueryConstructor {
  static constructQuery<T extends ObjectLiteral>(
    repository: Repository<T>,
    query: CollectionQuery,
  ): SelectQueryBuilder<T> {
    const langs = ['am', 'en'];
    const aggregateColumns: any = {};
    const metaData = repository.manager.connection.getMetadata(
      repository.target,
    );
    metaData.columns.map((c) => {
      aggregateColumns[c.databasePath] = c.type;
    });
    const {
      top,
      skip,
      searchFrom,
      filter,
      search,
      orderBy,
      includes,
      select,
      locale,
      groupBy,
    } = query;

    const aggregate = this.toSnackCase(metaData.tableName);
    const queryBuilder = repository.createQueryBuilder(aggregate);

    if (select) {
      queryBuilder.select(
        select.map((s) => {
          return s.indexOf('.') === -1 ? `${aggregate}.${s}` : s;
        }),
      );
    }
    if (includes) {
      includes.forEach((include) => {
        queryBuilder.leftJoinAndSelect(`${aggregate}.${include}`, include);
      });
    }
    //Filtering goes here
    if (filter) {
      filter.forEach((filters, index) => {
        let filterString = '';
        const filterParams: any = {};
        filters.forEach((f: any, filterIndex) => {
          const paramKey = filterIndex + '_' + index;
          const name = this.toSnackCase(f.field);

          const columnName =
            f.field.indexOf('.') === -1 ? `${aggregate}.${name}` : name;
          switch (f.operator) {
            case FilterOperators.EqualTo: {
              if (aggregateColumns[name] === 'jsonb') {
                langs.forEach((lang, i) => {
                  filterString +=
                    i === 0 && filterIndex === 0
                      ? ` ${columnName}->>'${lang}' = :${f.field}${lang}${paramKey} `
                      : ` OR ${columnName}->>'${lang}' = :${f.field}${lang}${paramKey} `;
                  filterParams[`${f.field}${lang}${paramKey}`] = f.value;
                });
              } else {
                filterString +=
                  filterIndex === 0
                    ? ` ${columnName} = :${f.field}${paramKey} `
                    : ` OR ${columnName} = :${f.field}${paramKey} `;
                filterParams[`${f.field}${paramKey}`] = f.value;
              }
              break;
            }
            case FilterOperators.Between: {
              if (Array.isArray(f.value)) {
                if (f.value.length >= 2) {
                  filterString +=
                    filterIndex === 0
                      ? ` (${columnName} between :${f.field}${paramKey}1 and :${f.field}${paramKey}2) `
                      : ` OR (${columnName} between :${f.field}${paramKey}1 and :${f.field}${paramKey}2) `;
                  filterParams[`${f.field}${paramKey}1`] = f.value[0];
                  filterParams[`${f.field}${paramKey}2`] = f.value[1];
                }
              } else {
                const values = f.value.split(',');
                filterString +=
                  filterIndex === 0
                    ? ` (${columnName} between :${f.field}${paramKey}1 and :${f.field}${paramKey}2) `
                    : ` OR (${columnName} between :${f.field}${paramKey}1 and :${f.field}${paramKey}2) `;
                filterParams[`${f.field}${paramKey}1`] = values[0];
                filterParams[`${f.field}${paramKey}2`] = values[1];
              }
              break;
            }
            case FilterOperators.LessThan: {
              filterString +=
                filterIndex === 0
                  ? ` ${columnName} < :${f.field}${paramKey} `
                  : ` OR ${columnName} < :${f.field}${paramKey} `;
              filterParams[`${f.field}${paramKey}`] = f.value;
              break;
            }
            case FilterOperators.LessThanOrEqualTo: {
              filterString +=
                filterIndex === 0
                  ? ` ${columnName} <= :${f.field}${paramKey} `
                  : ` OR ${columnName} <= :${f.field}${paramKey} `;
              filterParams[`${f.field}${paramKey}`] = f.value;
              break;
            }
            case FilterOperators.GreaterThan: {
              filterString +=
                filterIndex === 0
                  ? ` ${columnName} > :${f.field}${paramKey} `
                  : ` OR ${columnName} > :${f.field}${paramKey} `;
              filterParams[`${f.field}${paramKey}`] = f.value;

              break;
            }
            case FilterOperators.GreaterThanOrEqualTo: {
              filterString +=
                filterIndex === 0
                  ? ` ${columnName} >= :${f.field}${paramKey} `
                  : ` OR ${columnName} >= :${f.field}${paramKey} `;
              filterParams[`${f.field}${paramKey}`] = f.value;

              break;
            }
            case FilterOperators.In: {
              if (Array.isArray(f.value)) {
                filterString +=
                  filterIndex === 0
                    ? ` ${columnName} IN(:...${f.field}${paramKey}) `
                    : ` OR ${columnName} IN(:...${f.field}${paramKey}) `;
                filterParams[`${f.field}${paramKey}`] = f.value;
              } else {
                const values = f.value.split(',');
                filterString +=
                  filterIndex === 0
                    ? ` ${columnName} IN(:...${f.field}${paramKey}) `
                    : ` OR ${columnName} IN(:...${f.field}${paramKey}) `;
                filterParams[`${f.field}${paramKey}`] = values;
              }
              break;
            }
            case FilterOperators.Any: {
              if (Array.isArray(f.value)) {
                filterString +=
                  filterIndex === 0
                    ? ` ${columnName} = ANY(:${f.field}${paramKey}) `
                    : ` OR ${columnName} = ANY(:${f.field}${paramKey}) `;
                filterParams[`${f.field}${paramKey}`] = f.value;
              } else {
                const values = f.value.split(',');
                filterString +=
                  filterIndex === 0
                    ? ` ${columnName} = ANY(:${f.field}${paramKey}) `
                    : ` OR ${columnName} = ANY(:${f.field}${paramKey}) `;
                filterParams[`${f.field}${paramKey}`] = values;
              }
              break;
            }
            case FilterOperators.NotNull: {
              filterString +=
                filterIndex === 0
                  ? ` ${columnName} is not null `
                  : ` OR ${columnName} is not null `;
              break;
            }
            case FilterOperators.IsNull: {
              filterString +=
                filterIndex === 0
                  ? ` ${columnName} is null `
                  : ` OR ${columnName} is null `;
              break;
            }

            case FilterOperators.NotEqualTo: {
              if (aggregateColumns[name] === 'jsonb') {
                langs.forEach((lang, i) => {
                  filterString +=
                    i === 0 && filterIndex === 0
                      ? ` ${columnName}->>'${lang}' != :${f.field}${lang}${paramKey} `
                      : ` OR ${columnName}->>'${lang}' != :${f.field}${lang}${paramKey} `;
                  filterParams[`${f.field}${lang}${paramKey}`] = f.value;
                });
              } else {
                filterString +=
                  filterIndex === 0
                    ? ` ${columnName} != :${f.field}${paramKey} `
                    : ` OR ${columnName} != :${f.field}${paramKey} `;
                filterParams[`${f.field}${paramKey}`] = f.value;
              }
              break;
            }
            case FilterOperators.Like: {
              if (aggregateColumns[name] === 'jsonb') {
                langs.forEach((lang, i) => {
                  filterString +=
                    i === 0 && filterIndex === 0
                      ? ` ${columnName}->>'${lang}' ilike :${f.field}${lang}${paramKey} `
                      : ` OR ${columnName}->>'${lang}' ilike :${f.field}${lang}${paramKey} `;
                  filterParams[`${f.field}${lang}${paramKey}`] = `%${f.value}%`;
                });
              } else {
                filterString +=
                  filterIndex === 0
                    ? ` ${columnName} ilike :${f.field}${paramKey} `
                    : ` OR ${columnName} ilike :${f.field}${paramKey} `;
                filterParams[`${f.field}${paramKey}`] = `%${f.value}%`;
              }
              break;
            }
            case FilterOperators.NotIn:
              if (Array.isArray(f.value)) {
                filterString +=
                  filterIndex === 0
                    ? ` ${columnName} NOT IN(:...${f.field}${paramKey}) `
                    : ` OR ${columnName} NOT IN(:...${f.field}${paramKey}) `;
                filterParams[`${f.field}${paramKey}`] = f.value;
              } else {
                const values = f.value.split(',');
                filterString +=
                  filterIndex === 0
                    ? ` ${columnName} NOT IN(:...${f.field}${paramKey}) `
                    : ` OR ${columnName} NOT IN(:...${f.field}${paramKey}) `;
                filterParams[`${f.field}${paramKey}`] = values;
              }
              break;
          }
        });
        index === 0
          ? queryBuilder.where(`(${filterString})`, filterParams)
          : queryBuilder.andWhere(`(${filterString})`, filterParams);
      });
    }
    if (search && searchFrom) {
      let searchQuery = '';
      const searchParams: any = {};
      searchFrom.forEach((item: string, index: number) => {
        const columnName = this.toSnackCase(item);
        const paramKey = 'search_' + item;
        if (aggregateColumns[columnName] === 'jsonb') {
          langs.forEach((lang, i) => {
            searchQuery +=
              i === 0 && index === 0
                ? ` ${aggregate}.${columnName}->>'${lang}' ilike :${paramKey}${lang} `
                : ` OR ${aggregate}.${columnName}->>'${lang}' ilike :${paramKey}${lang} `;
            searchParams[`${paramKey}${lang}`] = `%${search}%`;
          });
        } else {
          searchQuery +=
            index === 0
              ? ` ${aggregate}.${columnName} ilike :${paramKey} `
              : ` OR ${aggregate}.${columnName} ilike :${paramKey} `;
          searchParams[paramKey] = `%${search}%`;
        }
      });
      queryBuilder.andWhere(`(${searchQuery})`, searchParams);
    }
    if (groupBy) {
      groupBy.forEach((item, index) => {
        index === 0
          ? queryBuilder.groupBy(`${aggregate}.${item}`)
          : queryBuilder.addGroupBy(`${aggregate}.${item}`);
      });
    }
    // if (!orderBy) {
    //   queryBuilder.orderBy('RANDOM()');
    // }
    if (orderBy) {
      const orderedBy: any = {};
      orderBy.forEach((order) => {
        orderedBy[`${aggregate}.${order.field}`] =
          order.direction?.toUpperCase();
      });
      queryBuilder.orderBy(orderedBy);
    }
    if (top) {
      queryBuilder.take(top);
    }
    if (skip) {
      queryBuilder.skip(skip);
    }
    return queryBuilder;
  }
  static toSnackCase(text: string) {
    // const result = text.trim().replace(/([A-Z])/g, ' $1');
    // const upperStr = result.split(' ');
    // const lowerArray = upperStr.map((t) => {
    //   return t.toLocaleLowerCase();
    // });
    // return lowerArray.join('_');

    return text;
  }
}
