import { flattenDeep } from 'lodash-es';
import { CollectionQuery, DetailQuery } from '../models/collection.model';

export type apiType = 'ps' | 'strapi';
export const collectionQueryBuilder = (
  request: CollectionQuery,
  type: apiType = 'ps',
) => {
  const params = new URLSearchParams();
  if (request?.skip !== undefined) {
    const skip = type === 'strapi' ? '_start' : 'skip';
    params?.set(skip, request.skip.toString());
  }

  if (request?.top !== undefined) {
    const top = type === 'strapi' ? '_limit' : 'top';
    params?.set(top, request.top.toString());
  }
  if (request?.locale !== undefined) {
    params?.set('locale', request.locale);
  }

  if (request?.search !== undefined) {
    params?.set('search', request.search.toString());
  }

  if (request?.searchFrom && request?.searchFrom?.length > 0) {
    request?.searchFrom?.forEach((searchFrom, index) => {
      // search from
      params?.append(`searchFrom[${index}]`, searchFrom.toString());
    });
  }

  if (request?.orderBy && request?.orderBy?.length > 0) {
    request?.orderBy?.forEach((orderBy: any, index) => {
      Object.keys(orderBy).forEach((key) => {
        params?.append(`orderBy[${index}][${key}]`, encodeURI(orderBy[key]));
      });
    });
  }
  if (request?.groupBy && request?.groupBy?.length > 0) {
    request?.groupBy?.forEach((groupBy, index) => {
      params?.append(`groupBy[${index}]`, encodeURI(groupBy));
    });
  }
  if (request?.filter && request?.filter?.length > 0) {
    if (type === 'strapi') {
      const flat = flattenDeep(request?.filter);
      const operators: any = {
        '=': '_eq',
      };
      flat?.forEach((r: any) => {
        const f = `${r['field']}${operators[r['operator']]}`;
        params?.append(f, r['value']);
      });
    } else {
      request?.filter?.forEach((filterAnd, index) => {
        filterAnd.forEach((filterOr: any, orIndex) => {
          Object.keys(filterOr).forEach((key) => {
            params?.append(
              `filter[${index}][${orIndex}][${key}]`,
              filterOr[key],
            );
          });
        });
      });
    }
  }
  if (request?.select && request?.search) {
    request?.select.forEach((select, index) => {
      params.append(`select[${index}]`, select);
    });
  }
  if (request?.includes && request.includes?.length > 0) {
    request.includes.forEach((include, index) => {
      params.append(`includes[${index}]`, include);
    });
  }
  if (request?.count !== undefined) {
    params?.set('count', request?.count.toString());
  }

  return params;
};
export const findById = (id: string, locale: any) => {
  const request: DetailQuery = {
    filter: [
      [
        {
          field: 'id',
          value: id,
          operator: '=',
        },
      ],
    ],
  };
  request.locale = locale;

  return collectionQueryBuilder(request);
};
