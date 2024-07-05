import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const invitationItemsApi = createApi({
  reducerPath: 'invitationItemsApi',
  tagTypes: ['sol-items', 'invitation-items'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_RFX_API ?? '/marketplace/api/'),
  endpoints: (builder) => ({
    getMyItems: builder.query<
      any,
      { id: string; collectionQuery: CollectionQuery | undefined }
    >({
      query: ({ id, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/rfx-product-invitations/my-rfx-items/${id}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['invitation-items'],
    }),
    rfxDetail: builder.query<any, any>({
      query: (id: string) => {
        return {
          url: `/rfx-product-invitations/rfx-detail/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['invitation-items'],
    }),
    getMatchedProducts: builder.query<
      any,
      { id: string; collectionQuery: CollectionQuery | undefined }
    >({
      query: ({ id, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/rfx-product-invitations/my-rfx-invitations/${id}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['invitation-items'],
    }),
    getDocumentaryEvidences: builder.query<
      any,
      { id: string; collectionQuery: CollectionQuery | undefined }
    >({
      query: ({ id, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/rfx-documentary-evidences/list/${id}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['invitation-items'],
    }),
    addItemOffer: builder.mutation<any, any>({
      query: (body) => {
        return {
          url: `/sol-offers`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['invitation-items'],
    }),
    getItemOffer: builder.query<any, { id: string; rfxId: string }>({
      query: ({ id, rfxId }) => {
        return {
          url: `/sol-offers/my-latest-offer/${id}/${rfxId}`,
          method: 'GET',
        };
      },
      providesTags: ['invitation-items'],
    }),
    modifyItemOffer: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/sol-offers/${data.id}`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['invitation-items'],
    }),
    uploadDocumentaryEvidence: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/sol-responses`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['invitation-items'],
    }),
    getUploadedEvidences: builder.query<
      any,
      { rfxId: string; rfxDoumentaryEvidenceId: string }
    >({
      query: ({ rfxId, rfxDoumentaryEvidenceId }) => {
        return {
          url: `/sol-responses/my-documents/${rfxId}/${rfxDoumentaryEvidenceId}`,
          method: 'GET',
        };
      },
      providesTags: ['invitation-items'],
    }),
    acceptInvitation: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/rfx-product-invitations/accept-invitation/${data.invitationId}`,
          method: 'PATCH',
          body: data,
        };
      },
      invalidatesTags: ['invitation-items'],
    }),
    withdrawInvitation: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/rfx-product-invitations/withdraw-invitation/${data.invitationId}`,
          method: 'PATCH',
          body: data,
        };
      },
      invalidatesTags: ['invitation-items'],
    }),
    getAwardedRfqs: builder.query<any, any>({
      query: ({ id }) => {
        return {
          url: `sol-round-awards/my-awards`,
          method: 'GET',
        };
      },
      providesTags: ['invitation-items'],
    }),
    giveSpecForOpen: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/rfx-product-invitations/apply-on-invitation`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['invitation-items'],
    }),
    getRfxItemWithSpec: builder.query<
      any,
      { rfxId: string; collectionQuery: CollectionQuery }
    >({
      query: ({ collectionQuery, rfxId }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/rfx-product-invitations/my-rfx-items-with-spec/${rfxId}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['invitation-items'],
    }),
    getMyAwardedItems: builder.query<
      any,
      { rfxId: string; collectionQuery: CollectionQuery }
    >({
      query: ({ collectionQuery, rfxId }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/rfx-items/my-awarded-items/${rfxId}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['invitation-items'],
    }),
    acceptOrRejectAward: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/award-items/respond-award/${data?.id}`,
          method: 'PATCH',
          body: data,
        };
      },
      invalidatesTags: ['invitation-items'],
    }),
  }),
});

export const {
  useLazyGetMyItemsQuery,
  useLazyGetMatchedProductsQuery,
  useLazyRfxDetailQuery,
  useGetItemOfferQuery,
  useLazyGetItemOfferQuery,
  useModifyItemOfferMutation,
  useAddItemOfferMutation,
  useLazyGetDocumentaryEvidencesQuery,
  useUploadDocumentaryEvidenceMutation,
  useLazyGetUploadedEvidencesQuery,
  useAcceptInvitationMutation,
  useWithdrawInvitationMutation,
  useLazyGetAwardedRfqsQuery,
  useGiveSpecForOpenMutation,
  useLazyGetRfxItemWithSpecQuery,
  useLazyGetMyAwardedItemsQuery,
  useAcceptOrRejectAwardMutation,
} = invitationItemsApi;
