import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const specApi = createApi({
  reducerPath: 'specApi',
  tagTypes: ['SpecificationTemplate'],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  ),
  endpoints: (builder) => ({
    getTemplate: builder.query<any, string>({
      query: (id) => ({
        url: `specification-templates/item/${id}`,
      }),
      providesTags: ['SpecificationTemplate'],
    }),

    createTemplate: builder.mutation<any, any>({
      query: (data) => ({
        url: `specification-templates`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SpecificationTemplate'],
    }),
    updateTemplate: builder.mutation<any, any>({
      query: ({ id, ...data }) => ({
        url: `specification-templates/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['SpecificationTemplate'],
    }),
    copyTemplate: builder.mutation<any, any>({
      query: (data) => ({
        url: `specification-templates/copy-template`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SpecificationTemplate'],
    }),
    deleteTemplate: builder.mutation<any, string>({
      query: (id) => ({
        url: `specification-templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SpecificationTemplate'],
    }),
  }),
});

export const {
  useLazyGetTemplateQuery,
  useGetTemplateQuery,

  useCreateTemplateMutation,
  useUpdateTemplateMutation,

  useCopyTemplateMutation,
  useDeleteTemplateMutation,
} = specApi;
