import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const tenderTemplateApi = createApi({
  reducerPath: 'tenderTemplateApi',
  tagTypes: ['tender-templates'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    uploadBdsTemplate: builder.mutation<any, any>({
      query: (data: { id: string; type: string; file: File }) => ({
        url: `tender-spd/upload-bds/${data.id}`,
        method: 'POST',
        body: data.file,
      }),
      invalidatesTags: ['tender-templates'],
    }),
    uploadSccTemplate: builder.mutation<any, any>({
      query: (data: { id: string; type: string; file: File }) => ({
        url: `tender-spd/upload-scc/${data.id}`,
        method: 'POST',
        body: data.file,
      }),
      invalidatesTags: ['tender-templates'],
    }),
    getFiles: builder.query<any, any>({
      query: (args: { id: string; type: string }) => ({
        url: `tender-templates/download-tender-pdf/${args.id}/${args.type}`,
      }),
      providesTags: ['tender-templates'],
    }),
  }),
});

export const {
  useUploadBdsTemplateMutation,
  useUploadSccTemplateMutation,
  useGetFilesQuery,
  useLazyGetFilesQuery,
} = tenderTemplateApi;
