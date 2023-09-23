import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Unit } from '@/models/user/unit';
import { unitBaseUrl } from './base-urls';

export const unitApi = createApi({
  reducerPath: 'unitApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: unitBaseUrl,
  }),
  tagTypes: ['Unit', 'Units'],
  endpoints: (builder) => ({
    getUnits: builder.query<any, null>({
      query: () => 'get-all',
      providesTags: ['Units'],
    }),
    getUnitById: builder.query<Unit, { id: string }>({
      query: (id) => `${id}`,
      providesTags: ['Unit'],
    }),

    addNewUnit: builder.mutation<any, any>({
      query: (newunit) => {
        return {
          url: ``,
          method: 'POST',
          body: newunit,
        };
      },
      invalidatesTags: ['Unit', 'Units'],
    }),

    updateUnit: builder.mutation<any, any>({
      query: (unit) => {
        return {
          url: `${unit.id}`,
          method: 'PUT',
          body: unit,
        };
      },
      invalidatesTags: ['Unit', 'Units'],
    }),
    deleteUnit: builder.mutation<any, any>({
      query: (unit: { id: any }) => {
        return {
          url: `${unit.id}`,
          method: 'DELETE',
          body: unit,
        };
      },
      invalidatesTags: ['Unit', 'Units'],
    }),
  }),
});

export const {
  useGetUnitsQuery,
  useLazyGetUnitsQuery,
  useGetUnitByIdQuery,
  useAddNewUnitMutation,
  useDeleteUnitMutation,
  useUpdateUnitMutation,
} = unitApi;
