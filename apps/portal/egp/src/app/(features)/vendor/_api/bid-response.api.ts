import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const checkPasswordApi = createApi({
  reducerPath: 'checkPasswordApi',
  tagTypes: ['bid-response'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    checkPassword: builder.mutation<any, any>({
      query: (data: {
        tenderId: string;
        documentType: string;
        password: string;
      }) => ({
        url: `bid-responses/check-password`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['bid-response'],
    }),
    checkRFXPassword: builder.mutation<any, any>({
      query: (data: { rfxId: string; password: string }) => ({
        url: `rfx-bid-responses/check-password`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['bid-response'],
    }),
  }),
});

export const { useCheckPasswordMutation, useCheckRFXPasswordMutation } =
  checkPasswordApi;
