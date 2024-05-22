import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const sorDocumentApi = createApi({
  reducerPath: 'documentApi',
  refetchOnFocus: true,
  tagTypes: ['sor-documents'],
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_RFX_API ?? '/rfx/api/'),
  endpoints: (builder) => ({
    upload: builder.mutation<any, any>({
      query: (data) => ({
        url: 'sor-documents/upload',
        method: 'POST',
        body: data,
      }),
    }),

    preSignedUrl: builder.mutation<any, any>({
      query: (data) => ({
        url: 'sor-documents',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['sor-documents'],
    }),

    getFiles: builder.query<any, any>({
      query: (id: string) => ({
        url: `sor-documents/list/${id}`,
      }),
      providesTags: ['sor-documents'],
    }),
    downloadFiles: builder.query<any, any>({
      query: (id: string) => ({
        url: `sor-documents/download/${id}`,
      }),
      providesTags: ['sor-documents'],
    }),
  }),
});

export const {
  useUploadMutation,
  useGetFilesQuery,
  useLazyDownloadFilesQuery,
  usePreSignedUrlMutation,
} = sorDocumentApi;
