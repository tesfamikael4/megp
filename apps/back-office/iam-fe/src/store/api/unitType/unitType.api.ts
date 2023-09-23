import { CollectionQuery } from '@/shared/core/models';
import { collectionQueryBuilder } from '@/shared/core/utilities';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { User } from '@/models/user';

export const UnitTypeApi = createApi({
  reducerPath: 'UnitTypeApi',
  refetchOnFocus: true,
  tagTypes: ['unitType', 'unitTypes'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_IAM_API}`,
  }),
  endpoints: (builder) => ({
    getUnitType: builder.query<any, any>({
      query: (items: { items: CollectionQuery }) => ({
        url: 'unitTypes/get-all',
        params: collectionQueryBuilder(items.items),
      }),

      providesTags: ['unitTypes'],
    }),

    getUnitTypeById: builder.query<any, string>({
      query: (id) => ({
        url: `/unitTypes/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['unitType'],
    }),
    addUnitType: builder.mutation<any, any>({
      query: (UnitType) => {
        return {
          url: 'unitTypes/create',
          method: 'POST',
          body: UnitType,
        };
      },

      invalidatesTags: ['unitTypes'],
    }),
    updateUnitType: builder.mutation<any, any>({
      query: (updatedUnitType) => {
        return {
          url: `unitTypes/update/${updatedUnitType.id}`,
          method: 'PATCH',
          body: updatedUnitType,
        };
      },
      invalidatesTags: ['unitType', 'unitTypes'],
    }),
    deleteUnitType: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `unitTypes/delete/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['unitTypes'],
    }),
  }),
});

export const {
  useAddUnitTypeMutation,
  useUpdateUnitTypeMutation,
  useGetUnitTypeByIdQuery,
  useLazyGetUnitTypeByIdQuery,
  useLazyGetUnitTypeQuery,
  useGetUnitTypeQuery,
  useDeleteUnitTypeMutation,
} = UnitTypeApi;
