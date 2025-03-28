import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const invitationDocumentApi = createApi({
  reducerPath: 'invitationDocumentApi',
  tagTypes: ['spd-templates'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    getFiles: builder.query<any, any>({
      query: (id: string) => ({
        url: `tenders/download-invitation-document/${id}`,
      }),
      providesTags: ['spd-templates'],
    }),
    getBidFormFiles: builder.query<any, any>({
      query: (id: string) => ({
        url: `spd-bid-forms/download/${id}`,
      }),
      providesTags: ['spd-templates'],
    }),
  }),
});

export const {
  useGetFilesQuery,
  useLazyGetFilesQuery,
  useGetBidFormFilesQuery,
} = invitationDocumentApi;
