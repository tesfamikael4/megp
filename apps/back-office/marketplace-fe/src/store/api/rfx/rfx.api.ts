import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const rfxOtherApi = createApi({
  reducerPath: 'rfxOtherApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_RFX_API ?? '/marketplace/api/'),
  endpoints: (builder) => ({
    getCatalogueItems: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `rfx-catalogue${q}` };
      },
    }),
    getInvitations: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `rfxs${q}` };
      },
    }),
    getItemTemplate: builder.query<any, { id: string }>({
      query: (data) => ({
        url: `documents/getDocumentByItemId/${data.id}`,
        method: 'GET',
      }),
    }),
    generatePdf: builder.mutation<any, { id: string }>({
      query: (data) => ({
        url: `rfxs/pdf-generate/${data.id}`,
        method: 'POST',
        body: data,
      }),
    }),
    submitForReview: builder.mutation<
      any,
      { id: string; reviewDeadline: Date | null }
    >({
      query: (data) => ({
        url: `rfxs/review/${data.id}`,
        method: 'POST',
        body: data,
      }),
    }),
    getPreSigned: builder.query<any, { id: string }>({
      query: (data) => ({
        url: `documents/getDocumentByItemId/${data.id}`,
        method: 'GET',
      }),
    }),
    submitForApproval: builder.mutation<any, { id: string }>({
      query: (data) => ({
        url: `rfxs/submit/${data.id}`,
        method: 'POST',
      }),
    }),
    handleApproval: builder.mutation<any, { rfxId: string; status: string }>({
      query: (data) => ({
        url: `rfx-revision-approvals`,
        method: 'POST',
        body: data,
      }),
    }),
    inviteSelected: builder.mutation<any, any>({
      query: (data) => ({
        url: `rfx-bid-invitations/invite-selected/${data.id}`,
        method: 'POST',
        body: data,
      }),
    }),
    cancelInvitation: builder.mutation<any, any>({
      query: (data) => ({
        url: `rfx-bid-invitations/remove-invitees/${data.id}`,
        method: 'POST',
      }),
    }),
    makeOpenInvitation: builder.mutation<any, any>({
      query: (data) => ({
        url: `rfx-bid-invitations/make-open-invitation/${data.id}`,
        method: 'POST',
      }),
    }),
    revisionApprovals: builder.mutation<any, any>({
      query: (data) => ({
        url: `rfx-revision-approvals`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLazyGetCatalogueItemsQuery,
  useSubmitForReviewMutation,
  useGetPreSignedQuery,
  useLazyGetPreSignedQuery,
  useSubmitForApprovalMutation,
  useLazyGetInvitationsQuery,
  useInviteSelectedMutation,
  useCancelInvitationMutation,
  useMakeOpenInvitationMutation,
  useRevisionApprovalsMutation,
  useHandleApprovalMutation,
} = rfxOtherApi;
