import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const preliminaryComplianceApi = createApi({
  reducerPath: 'preliminaryComplianceApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  tagTypes: ['evaluation', 'bidAttribute', 'bidder'],
  endpoints: (builder) => ({
    getOpenedTenders: builder.query<any, any>({
      query: ({ collectionQuery }: { collectionQuery?: CollectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/technical-preliminary-assessment-detail/opened-tenders${q}`,
          method: 'GET',
        };
      },
    }),

    getPassedBidders: builder.query<any, any>({
      query: ({ lotId, collectionQuery, team = 'member' }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/technical-preliminary-assessment-detail/bidders-status/${lotId}/${team}${q}`,
        };
      },
    }),
    getPreliminaryRequirementsByLotId: builder.query<any, any>({
      query: ({
        lotId,
        bidderId,
        team = 'member',
      }: {
        lotId: string;
        bidderId: string;
        team: string;
      }) => {
        return {
          url: `/technical-preliminary-assessment-detail/checklist-status/${lotId}/${bidderId}/${team}`,
        };
      },
      providesTags: ['bidAttribute'],
    }),
    createPreliminaryComplianceAssessment: builder.mutation<any, any>({
      query: (data) => ({
        url: `/technical-preliminary-assessment-detail`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['bidAttribute'],
    }),
    getCanPreliminaryComplete: builder.query<any, any>({
      query: (lotId) => {
        return {
          url: `/technical-preliminary-assessment-detail/can-complete/${lotId}`,
          method: 'GET',
        };
      },
      providesTags: ['evaluation', 'bidder'],
    }),
    submitPreliminaryEvaluation: builder.mutation<any, any>({
      query: (data: { tenderId: string; isTeamLead: boolean }) => {
        return {
          url: `/technical-preliminary-assessment-detail/submit-checklist`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['evaluation'],
    }),
    getPreliminaryMembersAssesmentResult: builder.query<any, any>({
      query: ({
        lotId,
        bidderId,
        requirementId,
      }: {
        lotId: string;
        bidderId: string;
        requirementId: string;
      }) =>
        `/technical-preliminary-assessment-detail/members-report/${lotId}/${bidderId}/${requirementId}`,
    }),

    getEqcPreliminaryExamination: builder.query<any, any>({
      query: (eqcId) => `/eqc-preliminary-examinations/${eqcId}`,
    }),

    completeEvaluation: builder.mutation<any, any>({
      query: (data: {
        lotId: string;
        bidderId: string;
        isTeamLead: boolean;
      }) => {
        return {
          url: `/technical-preliminary-assessment-detail/complete-bidder-evaluation`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['evaluation', 'bidder'],
    }),

    getComplianceAssessments: builder.query<any, any>({
      query: ({
        lotId,
        bidderId,
        team = 'member',
      }: {
        lotId: string;
        bidderId: string;
        team: string;
      }) =>
        `/technical-preliminary-assessment-detail/evaluator-report/${lotId}/${bidderId}/${team}`,
    }),
  }),
});

export const {
  useLazyGetOpenedTendersQuery,
  useLazyGetPassedBiddersQuery,
  useLazyGetPreliminaryRequirementsByLotIdQuery,
  useCreatePreliminaryComplianceAssessmentMutation,
  useLazyGetCanPreliminaryCompleteQuery,
  useSubmitPreliminaryEvaluationMutation,
  useLazyGetPreliminaryMembersAssesmentResultQuery,
  useLazyGetEqcPreliminaryExaminationQuery,
  useCompleteEvaluationMutation,
  useLazyGetComplianceAssessmentsQuery,
} = preliminaryComplianceApi;
