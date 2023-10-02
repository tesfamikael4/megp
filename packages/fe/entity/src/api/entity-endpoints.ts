import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Entity {
  id: string;
}

export const createEntitySlice = <T extends Entity>(
  api: ReturnType<typeof createApi>,
  entityName: string,
): any =>
  api.injectEndpoints({
    endpoints: (builder) => ({
      list: builder.query<T[], void>({
        query: () => ({
          url: `/${entityName.toLowerCase()}`,
          method: 'GET',
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ id }) => ({ type: entityName, id })),
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
        invalidatesTags: (result, error, { id }) => [{ type: entityName, id }],
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
    }),
    overrideExisting: false,
  });

export const EntitySliceApi = createApi({
  reducerPath: 'entityApi',
  tagTypes: ['entity'],
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    list: builder.query<any[], void>({
      query: () => ({
        url: '/entity',
        method: 'Get',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'entity' as const, id })),
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
  }),
});
