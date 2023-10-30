import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
        list: builder.query<EntityCollection<T>, void>({
          query: () => ({
            url: `/${entityName.toLowerCase()}`,
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
        delete: builder.mutation<{ success: boolean; id: string }, string>({
          query(id) {
            return {
              url: `/${entityName.toLowerCase()}/${id}`,
              method: 'DELETE',
            };
          },
          invalidatesTags: (result, error, id) => [{ type: entityName, id }],
        }),
        listById: builder.query<EntityCollection<T>, void>({
          query: () => ({
            url: `/${entityName.toLowerCase()}/list/099454a9-bf8f-45f5-9a4f-6e9034230250`,
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
        firstRelation: builder.query<EntityCollection<T>, string>({
          query: (id) => ({
            url: `/${entityName}/${id}/${firstEntity}`,
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

        secondRelation: builder.query<EntityCollection<T>, string>({
          query: (id) => ({
            url: `/${entityName}/${id}/${secondEntity}`,
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
      list: builder.query<{ items: any[] }, void>({
        query: () => ({
          url: '/entity',
          method: 'Get',
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
      delete: builder.mutation<{ success: boolean; id: string }, string>({
        query(id) {
          return {
            url: `/entity/${id}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: (result, error, id) => [{ type: 'entity', id }],
      }),

      listById: builder.query<{ items: any[] }, void>({
        query: () => ({
          url: `/entity/list/099454a9-bf8f-45f5-9a4f-6e9034230250`,
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

      firstRelation: builder.query<{ items: any[] }, string>({
        query: (id) => ({
          url: `/entity/${id}/firstEntity`,
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

      secondRelation: builder.query<{ items: any[] }, string>({
        query: (id) => ({
          url: `/entity/${id}/secondEntity`,
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
    };
  },
});
