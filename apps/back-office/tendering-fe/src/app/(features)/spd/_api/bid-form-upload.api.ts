import { BidForm } from '@/models/spd/bid-forms.model';
import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const templateSpdApi = createApi({
  reducerPath: 'templateSpdApi',
  tagTypes: ['spd-bid-forms-upload'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    uploadBidForm: builder.mutation<any, any>({
      query: (data: BidForm) => ({
        url: `spd-bid-forms/upload`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['spd-bid-forms-upload'],
    }),
    getFiles: builder.query<any, any>({
      query: (id: string) => ({
        url: `spd-bid-forms/download/${id}`,
      }),
      providesTags: ['spd-bid-forms-upload'],
    }),
  }),
});

export const {
  useUploadBidFormMutation,
  useGetFilesQuery,
  useLazyGetFilesQuery,
} = templateSpdApi;
