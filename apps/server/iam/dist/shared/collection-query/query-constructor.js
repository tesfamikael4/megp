"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryConstructor = void 0;
const filter_operators_1 = require("./filter_operators");
class QueryConstructor {
    static constructQuery(repository, query) {
        const langs = ['am', 'en'];
        const aggregateColumns = {};
        const metaData = repository.manager.connection.getMetadata(repository.target);
        metaData.columns.map((c) => {
            aggregateColumns[c.databasePath] = c.type;
        });
        const { top, skip, searchFrom, filter, search, orderBy, includes, select, locale, groupBy, } = query;
        const aggregate = this.toSnackCase(metaData.tableName);
        const queryBuilder = repository.createQueryBuilder(aggregate);
        if (select) {
            queryBuilder.select(select.map((s) => {
                return s.indexOf('.') === -1 ? `${aggregate}.${s}` : s;
            }));
        }
        if (includes) {
            includes.forEach((include) => {
                queryBuilder.leftJoinAndSelect(`${aggregate}.${include}`, include);
            });
        }
        if (filter) {
            filter.forEach((filters, index) => {
                let filterString = '';
                const filterParams = {};
                filters.forEach((f, filterIndex) => {
                    const paramKey = filterIndex + '_' + index;
                    const name = this.toSnackCase(f.field);
                    const columnName = f.field.indexOf('.') === -1 ? `${aggregate}.${name}` : name;
                    switch (f.operator) {
                        case filter_operators_1.FilterOperators.EqualTo: {
                            if (aggregateColumns[name] === 'jsonb') {
                                langs.forEach((lang, i) => {
                                    filterString +=
                                        i === 0 && filterIndex === 0
                                            ? ` ${columnName}->>'${lang}' = :${f.field}${lang}${paramKey} `
                                            : ` OR ${columnName}->>'${lang}' = :${f.field}${lang}${paramKey} `;
                                    filterParams[`${f.field}${lang}${paramKey}`] = f.value;
                                });
                            }
                            else {
                                filterString +=
                                    filterIndex === 0
                                        ? ` ${columnName} = :${f.field}${paramKey} `
                                        : ` OR ${columnName} = :${f.field}${paramKey} `;
                                filterParams[`${f.field}${paramKey}`] = f.value;
                            }
                            break;
                        }
                        case filter_operators_1.FilterOperators.Between: {
                            if (Array.isArray(f.value)) {
                                if (f.value.length >= 2) {
                                    filterString +=
                                        filterIndex === 0
                                            ? ` (${columnName} between :${f.field}${paramKey}1 and :${f.field}${paramKey}2) `
                                            : ` OR (${columnName} between :${f.field}${paramKey}1 and :${f.field}${paramKey}2) `;
                                    filterParams[`${f.field}${paramKey}1`] = f.value[0];
                                    filterParams[`${f.field}${paramKey}2`] = f.value[1];
                                }
                            }
                            else {
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
                        case filter_operators_1.FilterOperators.LessThan: {
                            filterString +=
                                filterIndex === 0
                                    ? ` ${columnName} < :${f.field}${paramKey} `
                                    : ` OR ${columnName} < :${f.field}${paramKey} `;
                            filterParams[`${f.field}${paramKey}`] = f.value;
                            break;
                        }
                        case filter_operators_1.FilterOperators.LessThanOrEqualTo: {
                            filterString +=
                                filterIndex === 0
                                    ? ` ${columnName} <= :${f.field}${paramKey} `
                                    : ` OR ${columnName} <= :${f.field}${paramKey} `;
                            filterParams[`${f.field}${paramKey}`] = f.value;
                            break;
                        }
                        case filter_operators_1.FilterOperators.GreaterThan: {
                            filterString +=
                                filterIndex === 0
                                    ? ` ${columnName} > :${f.field}${paramKey} `
                                    : ` OR ${columnName} > :${f.field}${paramKey} `;
                            filterParams[`${f.field}${paramKey}`] = f.value;
                            break;
                        }
                        case filter_operators_1.FilterOperators.GreaterThanOrEqualTo: {
                            filterString +=
                                filterIndex === 0
                                    ? ` ${columnName} >= :${f.field}${paramKey} `
                                    : ` OR ${columnName} >= :${f.field}${paramKey} `;
                            filterParams[`${f.field}${paramKey}`] = f.value;
                            break;
                        }
                        case filter_operators_1.FilterOperators.In: {
                            if (Array.isArray(f.value)) {
                                filterString +=
                                    filterIndex === 0
                                        ? ` ${columnName} IN(:...${f.field}${paramKey}) `
                                        : ` OR ${columnName} IN(:...${f.field}${paramKey}) `;
                                filterParams[`${f.field}${paramKey}`] = f.value;
                            }
                            else {
                                const values = f.value.split(',');
                                filterString +=
                                    filterIndex === 0
                                        ? ` ${columnName} IN(:...${f.field}${paramKey}) `
                                        : ` OR ${columnName} IN(:...${f.field}${paramKey}) `;
                                filterParams[`${f.field}${paramKey}`] = values;
                            }
                            break;
                        }
                        case filter_operators_1.FilterOperators.Any: {
                            if (Array.isArray(f.value)) {
                                filterString +=
                                    filterIndex === 0
                                        ? ` ${columnName} = ANY(:${f.field}${paramKey}) `
                                        : ` OR ${columnName} = ANY(:${f.field}${paramKey}) `;
                                filterParams[`${f.field}${paramKey}`] = f.value;
                            }
                            else {
                                const values = f.value.split(',');
                                filterString +=
                                    filterIndex === 0
                                        ? ` ${columnName} = ANY(:${f.field}${paramKey}) `
                                        : ` OR ${columnName} = ANY(:${f.field}${paramKey}) `;
                                filterParams[`${f.field}${paramKey}`] = values;
                            }
                            break;
                        }
                        case filter_operators_1.FilterOperators.NotNull: {
                            filterString +=
                                filterIndex === 0
                                    ? ` ${columnName} is not null `
                                    : ` OR ${columnName} is not null `;
                            break;
                        }
                        case filter_operators_1.FilterOperators.IsNull: {
                            filterString +=
                                filterIndex === 0
                                    ? ` ${columnName} is null `
                                    : ` OR ${columnName} is null `;
                            break;
                        }
                        case filter_operators_1.FilterOperators.NotEqualTo: {
                            if (aggregateColumns[name] === 'jsonb') {
                                langs.forEach((lang, i) => {
                                    filterString +=
                                        i === 0 && filterIndex === 0
                                            ? ` ${columnName}->>'${lang}' != :${f.field}${lang}${paramKey} `
                                            : ` OR ${columnName}->>'${lang}' != :${f.field}${lang}${paramKey} `;
                                    filterParams[`${f.field}${lang}${paramKey}`] = f.value;
                                });
                            }
                            else {
                                filterString +=
                                    filterIndex === 0
                                        ? ` ${columnName} != :${f.field}${paramKey} `
                                        : ` OR ${columnName} != :${f.field}${paramKey} `;
                                filterParams[`${f.field}${paramKey}`] = f.value;
                            }
                            break;
                        }
                        case filter_operators_1.FilterOperators.Like: {
                            if (aggregateColumns[name] === 'jsonb') {
                                langs.forEach((lang, i) => {
                                    filterString +=
                                        i === 0 && filterIndex === 0
                                            ? ` ${columnName}->>'${lang}' ilike :${f.field}${lang}${paramKey} `
                                            : ` OR ${columnName}->>'${lang}' ilike :${f.field}${lang}${paramKey} `;
                                    filterParams[`${f.field}${lang}${paramKey}`] = `%${f.value}%`;
                                });
                            }
                            else {
                                filterString +=
                                    filterIndex === 0
                                        ? ` ${columnName} ilike :${f.field}${paramKey} `
                                        : ` OR ${columnName} ilike :${f.field}${paramKey} `;
                                filterParams[`${f.field}${paramKey}`] = `%${f.value}%`;
                            }
                            break;
                        }
                        case filter_operators_1.FilterOperators.NotIn:
                            if (Array.isArray(f.value)) {
                                filterString +=
                                    filterIndex === 0
                                        ? ` ${columnName} NOT IN(:...${f.field}${paramKey}) `
                                        : ` OR ${columnName} NOT IN(:...${f.field}${paramKey}) `;
                                filterParams[`${f.field}${paramKey}`] = f.value;
                            }
                            else {
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
            const searchParams = {};
            searchFrom.forEach((item, index) => {
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
                }
                else {
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
        if (orderBy) {
            const orderedBy = {};
            orderBy.forEach((order) => {
                var _a;
                orderedBy[`${aggregate}.${order.field}`] =
                    (_a = order.direction) === null || _a === void 0 ? void 0 : _a.toUpperCase();
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
    static toSnackCase(text) {
        return text;
    }
}
exports.QueryConstructor = QueryConstructor;
//# sourceMappingURL=query-constructor.js.map