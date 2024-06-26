import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const rfxOtherApi = createApi({
  reducerPath: 'rfxOtherApi',
  refetchOnFocus: true,
  tagTypes: ['eval-responses:LIST'],
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_RFX_API ?? '/marketplace/api/'),
  endpoints: (builder) => ({
    listRfxs: builder.query<any, CollectionQuery>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `rfxs/preparation${q}` };
      },
    }),
    listRfxOnReview: builder.query<any, CollectionQuery>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `rfxs/revision${q}` };
      },
    }),
    listRfxOnEvaluation: builder.query<any, CollectionQuery>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `rfxs/evaluation${q}` };
      },
    }),
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
    canSubmitForReview: builder.query<any, { rfxId: string }>({
      query: (data) => ({
        url: `rfx/can-submit-for-review/${data.rfxId}`,
        method: 'GET',
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
        url: `rfx-product-invitations/invite-selected/${data.id}`,
        method: 'POST',
        body: data,
      }),
    }),
    cancelInvitation: builder.mutation<any, any>({
      query: (data) => ({
        url: `rfx-product-invitations/remove-invitees/${data.id}`,
        method: 'POST',
      }),
    }),
    cancelRFX: builder.mutation<any, { rfxId: string }>({
      query: (data) => ({
        url: `rfxs/cancel/${data.rfxId}`,
        method: 'PATCH',
      }),
    }),
    makeRFXOpen: builder.mutation<any, { rfxId: string }>({
      query: (data) => ({
        url: `rfxs/make-rfx-open/${data.rfxId}`,
        method: 'POST',
      }),
    }),
    makeRFXClosed: builder.mutation<any, { rfxId: string }>({
      query: (data) => ({
        url: `rfxs/make-close-rfx/${data.rfxId}`,
        method: 'POST',
      }),
    }),
    makeOpenInvitation: builder.mutation<any, any>({
      query: (data) => ({
        url: `rfx-product-invitations/make-open-invitation/${data.id}`,
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
    getSolicitationStatus: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `sol-registrations/solicitation-status${q}` };
      },
    }),
    getBiddersList: builder.query<
      any,
      {
        rfxId: string;
        isTeamAssessment: boolean;
        collectionQuery: CollectionQuery;
      }
    >({
      query: (data) => {
        let q = '';
        if (data.collectionQuery) {
          const query = encodeCollectionQuery(data.collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `team-members/evaluation-vendors-list/${data.rfxId}/${data.isTeamAssessment}${q}`,
        };
      },
    }),
    getMyResponse: builder.query<
      any,
      {
        rfxId: string;
        rfxDocumentaryEvidenceId: string;
        isTeamAssessment: boolean;
      }
    >({
      query: (data) => ({
        url: `/eval-responses/my-response/${data?.rfxId}/${data.rfxDocumentaryEvidenceId}/${data?.isTeamAssessment}`,
        method: 'GET',
      }),
    }),
    getMyResponses: builder.query<
      any,
      { rfxId: string; isTeamAssessment: boolean; bidderId: string }
    >({
      query: (data) => ({
        url: `/eval-responses/my-responses/${data?.rfxId}/${data?.bidderId}/${data?.isTeamAssessment}`,
        method: 'GET',
      }),
      providesTags: ['eval-responses:LIST'],
    }),
    getEvidenceAttachment: builder.query<
      any,
      { rfxId: string; rfxDocumentaryEvidenceId: string; bidderId: string }
    >({
      query: (data) => ({
        url: `/sol-responses/document/${data?.rfxId}/${data?.rfxDocumentaryEvidenceId}/${data?.bidderId}/`,
        method: 'GET',
      }),
    }),
    canSubmitForRfxApproval: builder.query<any, { rfxId: string }>({
      query: (data) => ({
        url: `/rfx-revision-approvals/can-submit/${data?.rfxId}`,
        method: 'GET',
      }),
      providesTags: ['eval-responses:LIST'],
    }),
    canSubmitEvaluation: builder.query<
      any,
      { bidderId: string; isTeamAssessment: boolean }
    >({
      query: (data) => ({
        url: `/eval-responses/can-submit-vendor-eval/${data?.bidderId}/${data?.isTeamAssessment}`,
        method: 'GET',
      }),
      providesTags: ['eval-responses:LIST'],
    }),
    canSubmitRFQ: builder.query<
      any,
      { rfxId: string; isTeamAssessment: boolean }
    >({
      query: (data) => ({
        url: `/eval-responses/can-submit-rfx-eval/${data?.rfxId}/${data?.isTeamAssessment}`,
        method: 'GET',
      }),
      providesTags: ['eval-responses:LIST'],
    }),
    canStartTeamAssesment: builder.query<any, { rfxId: string }>({
      query: (data) => ({
        url: `/eval-responses/can-start-team-assessment/${data?.rfxId}`,
        method: 'GET',
      }),
      providesTags: ['eval-responses:LIST'],
    }),
    submitEvaluation: builder.mutation<
      any,
      { bidderId: string; isTeamAssessment: boolean }
    >({
      query: (data) => ({
        url: `/eval-responses/submit-vendor-eval/${data?.bidderId}/${data?.isTeamAssessment}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['eval-responses:LIST'],
    }),
    submitRFXEvaluation: builder.mutation<
      any,
      { rfxId: string; isTeamAssessment: boolean }
    >({
      query: (data) => ({
        url: `/eval-responses/submit-rfx-eval/${data?.rfxId}/${data?.isTeamAssessment}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['eval-responses:LIST'],
    }),
    getTeamMembersEval: builder.query<
      any,
      { bidderId: string; rfxDocumentaryEvidenceId: string }
    >({
      query: (data) => ({
        url: `/eval-responses/team-members-eval/${data?.rfxDocumentaryEvidenceId}/${data?.bidderId}`,
        method: 'GET',
      }),
      providesTags: ['eval-responses:LIST'],
    }),
    createEval: builder.mutation<any, any>({
      query(body) {
        return {
          url: `/eval-responses`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['eval-responses:LIST'],
    }),
    updateEval: builder.mutation<any, any>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `/eval-responses/${id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['eval-responses:LIST'],
    }),
    checkIsTeamLead: builder.query<any, { rfxId: string }>({
      query: (data) => ({
        url: `/team-members/is-team-lead/${data?.rfxId}`,
        method: 'GET',
      }),
      providesTags: ['eval-responses:LIST'],
    }),
    getPresignedForEvalDoc: builder.query<
      any,
      { rfxId: string; requirmentId: string; bidderId: string }
    >({
      query: (data) => ({
        url: `/sol-reponses/document/${data?.rfxId}/${data?.requirmentId}/${data?.bidderId}`,
        method: 'GET',
      }),
      providesTags: ['eval-responses:LIST'],
    }),
  }),
});

export const {
  useLazyListRfxsQuery,
  useLazyListRfxOnReviewQuery,
  useLazyListRfxOnEvaluationQuery,
  useLazyGetCatalogueItemsQuery,
  useSubmitForReviewMutation,
  useLazyCanSubmitForReviewQuery,
  useGetPreSignedQuery,
  useLazyGetPreSignedQuery,
  useSubmitForApprovalMutation,
  useLazyGetInvitationsQuery,
  useInviteSelectedMutation,
  useCancelInvitationMutation,
  useMakeOpenInvitationMutation,
  useRevisionApprovalsMutation,
  useHandleApprovalMutation,
  useLazyGetBiddersListQuery,
  useGetMyResponseQuery,
  useLazyGetMyResponseQuery,
  useGetMyResponsesQuery,
  useLazyGetMyResponsesQuery,
  useLazyGetEvidenceAttachmentQuery,
  useLazyCanSubmitForRfxApprovalQuery,
  useLazyCanSubmitEvaluationQuery,
  useSubmitEvaluationMutation,
  useCreateEvalMutation,
  useUpdateEvalMutation,
  useLazyCanSubmitRFQQuery,
  useLazyCheckIsTeamLeadQuery,
  useLazyGetSolicitationStatusQuery,
  useLazyCanStartTeamAssesmentQuery,
  useLazyGetTeamMembersEvalQuery,
  useSubmitRFXEvaluationMutation,
  useLazyGetPresignedForEvalDocQuery,
  useCancelRFXMutation,
  useMakeRFXOpenMutation,
  useMakeRFXClosedMutation,
} = rfxOtherApi;
