import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const technicalScoring = createApi({
  reducerPath: 'technicalScoring',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  tagTypes: ['evaluation', 'bidAttribute', 'bidder'],
  endpoints: (builder) => ({
    getPassedBidders: builder.query<any, any>({
      query: ({ lotId, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/technical-scoring-assessment-detail/bidders-status/${lotId}${q}`,
        };
      },
    }),
    getScoringRequirementsByLotId: builder.query<any, any>({
      query: ({ lotId, bidderId }: { lotId: string; bidderId: string }) => {
        return {
          url: `/technical-scoring-assessment-detail/checklist-status/${lotId}/${bidderId}`,
        };
      },
      providesTags: ['bidAttribute'],
    }),
    createTechnicalScoringComplianceAssessment: builder.mutation<any, any>({
      query: (data) => ({
        url: `/technical-scoring-assessment-detail`,
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
    submitScoringEvaluation: builder.mutation<any, any>({
      query: (data: { tenderId: string; isTeamLead: boolean }) => {
        return {
          url: `/technical-scoring-assessment-detail/submit-checklist`,
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

    getEqcTechnicalScoring: builder.query<any, any>({
      query: (eqcId) => `/eqc-technical-scorings/${eqcId}`,
    }),

    completeScoringEvaluation: builder.mutation<any, any>({
      query: (data: {
        lotId: string;
        bidderId: string;
        isTeamLead: boolean;
      }) => {
        return {
          url: `/technical-scoring-assessment-detail/complete-bidder-evaluation`,
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
  useLazyGetPassedBiddersQuery,
  useLazyGetScoringRequirementsByLotIdQuery,
  useCreateTechnicalScoringComplianceAssessmentMutation,
  useLazyGetCanPreliminaryCompleteQuery,
  useSubmitScoringEvaluationMutation,
  useLazyGetPreliminaryMembersAssesmentResultQuery,
  useLazyGetEqcTechnicalScoringQuery,
  useGetEqcTechnicalScoringQuery,
  useCompleteScoringEvaluationMutation,
  useLazyGetComplianceAssessmentsQuery,
} = technicalScoring;
