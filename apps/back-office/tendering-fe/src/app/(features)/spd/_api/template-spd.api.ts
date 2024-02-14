import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const templateSpdApi = createApi({
  reducerPath: 'templateSpdApi',
  tagTypes: ['spd-templates'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    uploadSpd: builder.mutation<any, any>({
      query: (data: { id: string; file: File }) => ({
        url: `spd/upload-spd/${data.id}`,
        method: 'POST',
        body: data.file,
      }),
      invalidatesTags: ['spd-templates'],
    }),
    getFiles: builder.query<any, any>({
      query: (id: string) => ({
        url: `spd/download-spd/${id}`,
      }),
      providesTags: ['spd-templates'],
    }),
  }),
});

export const { useUploadSpdMutation, useGetFilesQuery } = templateSpdApi;
