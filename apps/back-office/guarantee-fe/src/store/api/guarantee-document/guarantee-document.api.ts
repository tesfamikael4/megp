import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
const URL = process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/';

export const guaranteeDocumentApi = createApi({
  reducerPath: 'download-document',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    getGuranateeDocument: builder.query<any, string>({
      query: (id) => `bid-guarantees/download-document/${id}`,
    }),
  }),
});

export const { useGetGuranateeDocumentQuery } = guaranteeDocumentApi;
