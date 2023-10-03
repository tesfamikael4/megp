// import { CollectionQuery, Where, Order } from '../models/query';
// import { SelectQueryBuilder } from 'typeorm';

import { logger } from '@megp/core-fe';

// // Define a function to build a TypeORM query based on CollectionQuery
// export function buildTypeORMQuery<T>(
//     query: CollectionQuery,
//     queryBuilder: SelectQueryBuilder<T>
// ): SelectQueryBuilder<T> {
//     // SELECT clause
//     if (query.select && query.select.length > 0) {
//         queryBuilder.select(query.select);
//     }

//     // WHERE clause
//     if (query.where) {
//         query.where.forEach((whereGroup) => {
//             const whereConditions = whereGroup.map((whereItem) => {
//                 const { column, operator, value } = whereItem;
//                 return `${column} ${operator} :${column}`;
//             });
//             queryBuilder.andWhere(`(${whereConditions.join(' OR ')})`, whereGroup.reduce((acc, item) => {
//                 acc[item.column] = item.value;
//                 return acc;
//             }, {}));
//         });
//     }

//     // TAKE clause
//     if (query.take !== undefined) {
//         queryBuilder.take(query.take);
//     }

//     // SKIP clause
//     if (query.skip !== undefined) {
//         queryBuilder.skip(query.skip);
//     }

//     // ORDER BY clause
//     if (query.orderBy) {
//         query.orderBy.forEach((orderItem) => {
//             const { column, direction } = orderItem;
//             queryBuilder.addOrderBy(column, direction);
//         });
//     }

//     // INCLUDES (JOIN) clause
//     if (query.includes) {
//         query.includes.forEach((include) => {
//             queryBuilder.leftJoinAndSelect(include, include);
//         });
//     }

//     // GROUP BY clause
//     if (query.groupBy) {
//         query.groupBy.forEach((groupByColumn) => {
//             queryBuilder.addGroupBy(groupByColumn);
//         });
//     }

//     // HAVING clause
//     if (query.having) {
//         query.having.forEach((havingGroup) => {
//             const havingConditions = havingGroup.map((havingItem) => {
//                 const { column, operator, value } = havingItem;
//                 return `${column} ${operator} :${column}`;
//             });
//             queryBuilder.andHaving(`(${havingConditions.join(' OR ')})`, havingGroup.reduce((acc, item) => {
//                 acc[item.column] = item.value;
//                 return acc;
//             }, {}));
//         });
//     }

//     return queryBuilder;
// }

// // Create a TypeORM query builder for your entity
// const queryBuilder: SelectQueryBuilder<User> = getConnection()
//     .getRepository(User)
//     .createQueryBuilder('user');

// // Define your CollectionQuery
// const query: CollectionQuery = {
//     select: ['id', 'name'],
//     where: [
//         [{ column: 'age', value: 30, operator: '>=' }],
//         [{ column: 'city', value: 'New York', operator: '=' }],
//     ],
//     take: 10,
//     skip: 0,
//     orderBy: [{ column: 'name', direction: 'asc' }],
//     includes: ['roles', 'profile'],
//     groupBy: ['department'],
//     having: [[{ column: 'COUNT(*)', value: 5, operator: '>' }]],
//     count: true,
// };

// // Build the TypeORM query using the CollectionQuery
// buildTypeORMQuery(query, queryBuilder);

// // Execute the query
// const result = await queryBuilder.getMany();

export const test = () => {
  logger.log('test');
};
