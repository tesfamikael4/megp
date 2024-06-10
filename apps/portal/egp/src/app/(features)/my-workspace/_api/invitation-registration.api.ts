import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const getInvitationsApi = createApi({
  reducerPath: 'getInvitationsApi',
  tagTypes: ['product-invitation'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_RFX_API ?? '/marketplace/api/'),
  endpoints: (builder) => ({
    invitations: builder.query<any, any>({
      query: (collectionQuery: CollectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/rfx-product-invitations/my-invitations${q}`,
          method: 'GET',
        };
      },
      providesTags: ['product-invitation'],
    }),
    rfxDetail: builder.query<any, any>({
      query: (id: string) => {
        return {
          url: `/rfx-product-invitations/my-rfx-detail/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['product-invitation'],
    }),
    register: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/sol-registrations`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['product-invitation'],
    }),
  }),
});

export const {
  useLazyInvitationsQuery,
  useRfxDetailQuery,
  useRegisterMutation,
} = getInvitationsApi;
