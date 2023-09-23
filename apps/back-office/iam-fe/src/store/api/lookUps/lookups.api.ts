import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { User } from '@/models/user';

export const organizationTypeApi = createApi({
  reducerPath: 'organizationTypeApi',
  refetchOnFocus: true,
  tagTypes: ['organizationTypes', 'organizationType'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_IAM_API}`,
  }),
  endpoints: (builder) => ({
    getOrganizationType: builder.query<any, any>({
      query: (data) => ({
        url: 'organizationTypes/get-all',
        method: 'GET',
        params: data,
      }),

      providesTags: ['organizationTypes'],
    }),
    getOrganizationTypeById: builder.query<any, string>({
      query: (id) => ({
        url: `organizationTypes/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['organizationType'],
    }),
    addOrganizationType: builder.mutation<any, any>({
      query: (organizationType) => {
        return {
          url: 'organizationTypes/create',
          method: 'POST',
          body: organizationType,
        };
      },

      invalidatesTags: ['organizationTypes'],
    }),
    updateOrganizationType: builder.mutation<any, any>({
      query: (updatedorganizationType) => {
        return {
          url: `organizationTypes/update/${updatedorganizationType.id}`,
          method: 'PATCH',
          body: updatedorganizationType,
        };
      },
      invalidatesTags: ['organizationTypes', 'organizationType'],
    }),
    deleteOrganizationType: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `organizationTypes/delete/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['organizationTypes'],
    }),
  }),
});

export const {
  useAddOrganizationTypeMutation,
  useUpdateOrganizationTypeMutation,
  useGetOrganizationTypeByIdQuery,
  useLazyGetOrganizationTypeByIdQuery,
  useLazyGetOrganizationTypeQuery,
  useGetOrganizationTypeQuery,
  useDeleteOrganizationTypeMutation,
} = organizationTypeApi;
