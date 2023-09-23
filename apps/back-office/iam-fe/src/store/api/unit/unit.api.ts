import { CollectionQuery } from '@/shared/core/models';
import { collectionQueryBuilder } from '@/shared/core/utilities';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const unitApi = createApi({
  reducerPath: 'unitApi',
  refetchOnFocus: true,
  tagTypes: ['units', 'unit', 'unitUser'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_IAM_API}`,
  }),
  endpoints: (builder) => ({
    getUnit: builder.query<any, any>({
      query: (items: { items: CollectionQuery }) => ({
        url: 'units/get-all',
        method: 'GET',
        params: collectionQueryBuilder(items.items),
      }),

      providesTags: ['units'],
    }),
    getUniById: builder.query<any, string>({
      query: (id) => ({
        url: `/units/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['unit'],
    }),
    addUnit: builder.mutation<any, any>({
      query: (unit) => {
        return {
          url: 'units/create',
          method: 'POST',
          body: unit,
        };
      },

      invalidatesTags: ['units'],
    }),
    updateUnit: builder.mutation<any, any>({
      query: (updatedunit) => {
        return {
          url: `units/update/${updatedunit.id}`,
          method: 'PATCH',
          body: updatedunit,
        };
      },
      invalidatesTags: ['unit', 'units'],
    }),
    deleteUnit: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `units/delete/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['units'],
    }),
    getUnitType: builder.query<any, any>({
      query: (unitType) => {
        return {
          url: `organization/get-organization-unit-types`,
          method: 'POST',
          body: unitType,
        };
      },
    }),

    addUnitType: builder.mutation<any, any>({
      query: (unitType) => {
        return {
          url: `organization/add-unit-type`,
          method: 'POST',
          body: unitType,
        };
      },
    }),
    updateUnitType: builder.mutation<any, any>({
      query: (unitType) => {
        return {
          url: `organization/update-unit-type/${unitType.id}`,
          method: 'PATCH',
          body: unitType,
        };
      },
    }),
    removeUnitType: builder.mutation<any, any>({
      query: (unitType) => {
        return {
          url: `organization/remove-unit-type/${unitType.id}`,
          method: 'DELETE',
          body: unitType,
        };
      },
    }),
    getUserByUnitId: builder.query<any, any>({
      query: (id) => {
        return {
          url: `units/get/${id}?includes[0]=userUnits.user`,
          method: 'GET',
        };
      },
      providesTags: ['unitUser'],
    }),

    AssignUserToUnit: builder.mutation<any, { data: any; id: any }>({
      query: ({ data, id }) => {
        return {
          url: `units/assign-users/${id}`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['unitUser'],
    }),

    getUser: builder.query<any, any>({
      query: () => {
        return {
          url: `users/get-all`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const {
  useLazyGetUnitQuery,
  useGetUnitQuery,
  useGetUniByIdQuery,
  useLazyGetUniByIdQuery,
  useAddUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,

  useLazyGetUnitTypeQuery,
  useGetUnitTypeQuery,
  useAddUnitTypeMutation,
  useUpdateUnitTypeMutation,
  useRemoveUnitTypeMutation,

  useLazyGetUserByUnitIdQuery,
  useGetUserByUnitIdQuery,
  useAssignUserToUnitMutation,

  useLazyGetUserQuery,
} = unitApi;
