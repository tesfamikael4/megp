import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const templateSpdApi = createApi({
  reducerPath: 'templateSpdApi',
  tagTypes: ['spd-templates'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    uploadSpd: builder.mutation<any, any>({
      query: (data: { id: string; type: string; file: File }) => ({
        url: `spd-templates/upload-spd/${data.id}/${data.type}`,
        method: 'POST',
        body: data.file,
      }),
      invalidatesTags: ['spd-templates'],
    }),
    getFiles: builder.query<any, any>({
      query: (args: { id: string; type: string }) => ({
        url: `spd-templates/download-spd-pdf/${args.id}/${args.type}`,
      }),
      providesTags: ['spd-templates'],
    }),
  }),
});

export const { useUploadSpdMutation, useGetFilesQuery, useLazyGetFilesQuery } =
  templateSpdApi;
