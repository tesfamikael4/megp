import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CollectionQuery } from '../models';
import { encodeCollectionQuery } from '../utilities/query-builder';

interface Entity {
  id: string;
}
interface EntityCollection<T> {
  items: T[];
  total: number;
}

export const createEntitySlice = <T extends Entity>(
  api: ReturnType<typeof createApi>,
  entityName: string,
  firstEntity?: string,
  secondEntity?: string,
): any =>
  api.injectEndpoints({
    endpoints: (builder) => {
      return {
        list: builder.query<EntityCollection<T>, CollectionQuery | undefined>({
          query: (collectionQuery) => {
            let q = '';
            if (collectionQuery) {
              const query = encodeCollectionQuery(collectionQuery);
              q = `?q=${query}`;
            }

            return {
              url: `/${entityName.toLowerCase()}${q}`,
              method: 'GET',
            };
          },
          providesTags: (result) =>
            result
              ? [
                  ...result.items.map(({ id }) => ({ type: entityName, id })),
                  { type: entityName, id: 'LIST' },
                ]
              : [{ type: entityName, id: 'LIST' }],
        }),
        listArchived: builder.query<
          EntityCollection<T>,
          CollectionQuery | undefined
        >({
          query: (collectionQuery) => {
            let q = '';
            if (collectionQuery) {
              const query = encodeCollectionQuery(collectionQuery);
              q = `?q=${query}`;
            }

            return {
              url: `/${entityName.toLowerCase()}/archived/items${q}`,
              method: 'GET',
            };
          },
          providesTags: (result) =>
            result
              ? [
                  ...result.items.map(({ id }) => ({ type: entityName, id })),
                  { type: entityName, id: 'LIST' },
                ]
              : [{ type: entityName, id: 'LIST' }],
        }),

        listArchivedById: builder.query<
          EntityCollection<T>,
          { id: string; collectionQuery: CollectionQuery | undefined }
        >({
          query: ({ id, collectionQuery }) => {
            let q = '';
            if (collectionQuery) {
              const query = encodeCollectionQuery(collectionQuery);
              q = `?q=${query}`;
            }
            return {
              url: `/${entityName.toLowerCase()}/list/archived/items/${id}${q}`,
              method: 'GET',
            };
          },
          providesTags: (result) =>
            result
              ? [
                  ...result.items.map(({ id }) => ({ type: entityName, id })),
                  { type: entityName, id: 'LIST' },
                ]
              : [{ type: entityName, id: 'LIST' }],
        }),

        read: builder.query<T, string>({
          query: (id) => ({
            url: `/${entityName.toLowerCase()}/${id}`,
            method: 'GET',
          }),
          providesTags: (result, error, id) => [{ type: entityName, id }],
        }),
        create: builder.mutation<T, Partial<T>>({
          query(body) {
            return {
              url: `/${entityName.toLowerCase()}`,
              method: 'POST',
              body,
            };
          },
          invalidatesTags: [{ type: entityName, id: 'LIST' }],
        }),
        update: builder.mutation<T, Partial<T>>({
          query(data) {
            const { id, ...body } = data;
            return {
              url: `/${entityName.toLowerCase()}/${id}`,
              method: 'PUT',
              body,
            };
          },
          invalidatesTags: (result, error, { id }) => [
            { type: entityName, id },
          ],
        }),
        restore: builder.mutation<T, string>({
          query(id) {
            return {
              url: `/${entityName.toLowerCase()}/restore/${id}`,
              method: 'PATCH',
            };
          },
          invalidatesTags: (result, error, id) => [{ type: entityName, id }],
        }),
        delete: builder.mutation<{ success: boolean; id: string }, string>({
          query(id) {
            return {
              url: `/${entityName.toLowerCase()}/${id}`,
              method: 'DELETE',
            };
          },
          invalidatesTags: (result, error, id) => [{ type: entityName, id }],
        }),
        listById: builder.query<
          EntityCollection<T>,
          { id: string; collectionQuery: CollectionQuery | undefined }
        >({
          query: ({ id, collectionQuery }) => {
            let q = '';
            if (collectionQuery) {
              const query = encodeCollectionQuery(collectionQuery);
              q = `?q=${query}`;
            }
            return {
              url: `/${entityName.toLowerCase()}/list/${id}${q}`,
              method: 'GET',
            };
          },
          providesTags: (result) =>
            result
              ? [
                  ...result.items.map(({ id }) => ({ type: entityName, id })),
                  { type: entityName, id: 'LIST' },
                ]
              : [{ type: entityName, id: 'LIST' }],
        }),
        listByAppId: builder.query<EntityCollection<T>, string>({
          query: (id) => ({
            url: `/${entityName.toLowerCase()}/list/${id}`,
            method: 'GET',
          }),
          providesTags: (result) =>
            result
              ? [
                  ...result.items.map(({ id }) => ({ type: entityName, id })),
                  { type: entityName, id: 'LIST' },
                ]
              : [{ type: entityName, id: 'LIST' }],
        }),
        relation: builder.mutation<any, any>({
          query: (body) => {
            return {
              url: `/${entityName.toLowerCase()}/assign-${secondEntity}`,
              method: 'POST',
              body,
            };
          },
          invalidatesTags: [{ type: entityName, id: 'LIST' }],
        }),
        reverseRelation: builder.mutation<any, any>({
          query: (body) => {
            return {
              url: `/${entityName.toLowerCase()}/assign-${firstEntity}`,
              method: 'POST',
              body,
            };
          },
          invalidatesTags: [{ type: entityName, id: 'LIST' }],
        }),
        firstRelation: builder.query<
          EntityCollection<T>,
          { id: string; collectionQuery: CollectionQuery | undefined }
        >({
          query: ({ id, collectionQuery }) => {
            let q = '';
            if (collectionQuery) {
              const query = encodeCollectionQuery(collectionQuery);
              q = `?q=${query}`;
            }
            return {
              url: `/${entityName}/${id}/${firstEntity}${q}`,
              method: 'GET',
            };
          },
          providesTags: (result) =>
            result
              ? [
                  ...result.items.map(({ id }) => ({ type: entityName, id })),
                  { type: entityName, id: 'LIST' },
                ]
              : [{ type: entityName, id: 'LIST' }],
        }),

        secondRelation: builder.query<
          EntityCollection<T>,
          { id: string; collectionQuery: CollectionQuery | undefined }
        >({
          query: ({ id, collectionQuery }) => {
            let q = '';
            if (collectionQuery) {
              const query = encodeCollectionQuery(collectionQuery);
              q = `?q=${query}`;
            }
            return {
              url: `/${entityName}/${id}/${secondEntity}${q}`,
              method: 'GET',
            };
          },
          providesTags: (result) =>
            result
              ? [
                  ...result.items.map(({ id }) => ({ type: entityName, id })),
                  { type: entityName, id: 'LIST' },
                ]
              : [{ type: entityName, id: 'LIST' }],
        }),
      };
    },
    overrideExisting: false,
  });

export const EntitySliceApi = createApi({
  reducerPath: 'entityApi',
  tagTypes: ['entity', 'firstEntity', 'secondEntity'],
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => {
    return {
      list: builder.query<
        { items: any[]; total: number },
        CollectionQuery | undefined
      >({
        query: (collectionQuery) => {
          let q = '';
          if (collectionQuery) {
            const query = encodeCollectionQuery(collectionQuery);
            q = `?q${query}`;
          }
          return {
            url: `/entity${q}`,
            method: 'GET',
          };
        },
        providesTags: (result) =>
          result
            ? [
                ...result.items.map(({ id }) => ({
                  type: 'entity' as const,
                  id,
                })),
                { type: 'entity', id: 'LIST' },
              ]
            : [{ type: 'entity', id: 'LIST' }],
      }),
      listArchived: builder.query<
        { items: any[]; total: number },
        CollectionQuery | undefined
      >({
        query: (collectionQuery) => {
          let q = '';
          if (collectionQuery) {
            const query = encodeCollectionQuery(collectionQuery);
            q = `?q${query}`;
          }
          return {
            url: `/entity/archived/items${q}`,
            method: 'GET',
          };
        },
        providesTags: (result) =>
          result
            ? [
                ...result.items.map(({ id }) => ({
                  type: 'entity' as const,
                  id,
                })),
                { type: 'entity', id: 'LIST' },
              ]
            : [{ type: 'entity', id: 'LIST' }],
      }),
      read: builder.query<any, string>({
        query: (id) => ({
          url: `/entity/${id}`,
          method: 'GET',
        }),
        providesTags: (result, error, id) => [{ type: 'entity', id }],
      }),
      create: builder.mutation<any, any>({
        query(body) {
          return {
            url: `/entity`,
            method: 'POST',
            body,
          };
        },
        invalidatesTags: [{ type: 'entity', id: 'LIST' }],
      }),
      update: builder.mutation<any, any>({
        query(data) {
          const { id, ...body } = data;
          return {
            url: `/${id}`,
            method: 'PUT',
            body,
          };
        },
        invalidatesTags: (result, error, { id }) => [{ type: 'entity', id }],
      }),
      restore: builder.mutation<any, string>({
        query(id) {
          return {
            url: `/entity/restore/${id}`,
            method: 'PATCH',
          };
        },
        invalidatesTags: (result, error, id) => [{ type: 'entity', id }],
      }),
      delete: builder.mutation<{ success: boolean; id: string }, string>({
        query(id) {
          return {
            url: `/entity/${id}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: (result, error, id) => [{ type: 'entity', id }],
      }),

      listById: builder.query<
        { items: any[]; total: number },
        { id: string; collectionQuery: CollectionQuery | undefined }
      >({
        query: ({ id, collectionQuery }) => {
          let q = '';
          if (collectionQuery) {
            const query = encodeCollectionQuery(collectionQuery);
            q = `?q${query}`;
          }
          return {
            url: `/entity/list/${id}${q}`,
            method: 'GET',
          };
        },
        providesTags: (result) =>
          result
            ? [
                ...result.items.map(({ id }) => ({
                  type: 'entity' as const,
                  id,
                })),
                { type: 'entity', id: 'LIST' },
              ]
            : [{ type: 'entity', id: 'LIST' }],
      }),
      listArchivedById: builder.query<
        { items: any[]; total: number },
        { id: string; collectionQuery: CollectionQuery | undefined }
      >({
        query: ({ id, collectionQuery }) => {
          let q = '';
          if (collectionQuery) {
            const query = encodeCollectionQuery(collectionQuery);
            q = `?q${query}`;
          }
          return {
            url: `/entity/list/archived/items/${id}${q}`,
            method: 'GET',
          };
        },
        providesTags: (result) =>
          result
            ? [
                ...result.items.map(({ id }) => ({
                  type: 'entity' as const,
                  id,
                })),
                { type: 'entity', id: 'LIST' },
              ]
            : [{ type: 'entity', id: 'LIST' }],
      }),
      listByAppId: builder.query<{ items: any[] }, string>({
        query: (id) => ({
          url: `/entity/list/${id}`,
          method: 'GET',
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.items.map(({ id }) => ({
                  type: 'entity' as const,
                  id,
                })),
                { type: 'entity', id: 'LIST' },
              ]
            : [{ type: 'entity', id: 'LIST' }],
      }),

      relation: builder.mutation<any, any>({
        query(body) {
          return {
            url: `/entity/assign-firstEntity`,
            method: 'POST',
            body,
          };
        },
        invalidatesTags: [{ type: 'entity', id: 'LIST' }],
      }),
      reverseRelation: builder.mutation<any, any>({
        query(body) {
          return {
            url: `/entity/assign-secondEntity`,
            method: 'POST',
            body,
          };
        },
        invalidatesTags: [{ type: 'entity', id: 'LIST' }],
      }),

      firstRelation: builder.query<
        { items: any[]; total: number },
        { id: string; collectionQuery: CollectionQuery | undefined }
      >({
        query: ({ id, collectionQuery }) => {
          let q = '';
          if (collectionQuery) {
            const query = encodeCollectionQuery(collectionQuery);
            q = `?q${query}`;
          }
          return {
            url: `/entity/${id}/firstEntity${q}`,
            method: 'GET',
          };
        },
        providesTags: (result) =>
          result
            ? [
                ...result.items.map(({ id }) => ({
                  type: 'entity' as const,
                  id,
                })),
                { type: 'entity', id: 'LIST' },
              ]
            : [{ type: 'entity', id: 'LIST' }],
      }),

      secondRelation: builder.query<
        { items: any[]; total: number },
        { id: string; collectionQuery: CollectionQuery | undefined }
      >({
        query: ({ id, collectionQuery }) => {
          let q = '';
          if (collectionQuery) {
            const query = encodeCollectionQuery(collectionQuery);
            q = `?q${query}`;
          }
          return {
            url: `/entity/${id}/secondEntity${q}`,
            method: 'GET',
          };
        },
        providesTags: (result) =>
          result
            ? [
                ...result.items.map(({ id }) => ({
                  type: 'entity' as const,
                  id,
                })),
                { type: 'entity', id: 'LIST' },
              ]
            : [{ type: 'entity', id: 'LIST' }],
      }),
    };
  },
});
