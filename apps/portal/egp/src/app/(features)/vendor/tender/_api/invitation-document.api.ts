import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const invitationDocumentApi = createApi({
  reducerPath: 'invitationDocumentApi',
  tagTypes: ['spd-templates'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    getFiles: builder.query<any, any>({
      query: (args: { id: string; type: string }) => ({
        url: `spd-templates/download-spd-pdf/${args.id}/main-document`,
      }),
      providesTags: ['spd-templates'],
    }),
  }),
});

export const { useGetFilesQuery, useLazyGetFilesQuery } = invitationDocumentApi;
