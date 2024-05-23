import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const technicalQualification = createApi({
  reducerPath: 'technicalQualification',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  tagTypes: ['evaluation', 'bidAttribute', 'bidder'],
  endpoints: (builder) => ({
    getPassedBidders: builder.query<any, any>({
      query: ({ lotId, collectionQuery, team = 'member' }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/technical-qualification-assessment-detail/bidders-status/${lotId}/${team}${q}`,
        };
      },
    }),
    getQualificationRequirementsByLotId: builder.query<any, any>({
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
          url: `/technical-qualification-assessment-detail/checklist-status/${lotId}/${bidderId}/${team}`,
        };
      },
      providesTags: ['bidAttribute'],
    }),

    getEqcQualification: builder.query<any, any>({
      query: (eqcId) => `/eqc-qualifications/${eqcId}`,
    }),
    createTechnicalQualificationAssessment: builder.mutation<any, any>({
      query: (data) => ({
        url: `/technical-qualification-assessment-detail`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['bidAttribute'],
    }),
    getQualificationAssessments: builder.query<any, any>({
      query: ({
        lotId,
        bidderId,
        team = 'member',
      }: {
        lotId: string;
        bidderId: string;
        team: string;
      }) =>
        `/technical-qualification-assessment-detail/evaluator-report/${lotId}/${bidderId}/${team}`,
    }),
    completeQualificationEvaluation: builder.mutation<any, any>({
      query: (data: {
        lotId: string;
        bidderId: string;
        isTeamLead: boolean;
      }) => {
        return {
          url: `/technical-qualification-assessment-detail/complete-bidder-evaluation`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['evaluation', 'bidder'],
    }),
    getCanQualificationComplete: builder.query<any, any>({
      query: (lotId) => {
        return {
          url: `/technical-qualification-assessment-detail/can-complete/${lotId}`,
          method: 'GET',
        };
      },
      providesTags: ['evaluation', 'bidder'],
    }),
    submitQualificationEvaluation: builder.mutation<any, any>({
      query: (data: { tenderId: string; isTeamLead: boolean }) => {
        return {
          url: `/technical-qualification-assessment-detail/submit-checklist`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['evaluation'],
    }),

    getQualificationMembersAssesment: builder.query<any, any>({
      query: ({
        lotId,
        bidderId,
        requirementId,
      }: {
        lotId: string;
        bidderId: string;
        requirementId: string;
      }) =>
        `/technical-qualification-assessment-detail/members-report/${lotId}/${bidderId}/${requirementId}`,
    }),
  }),
});

export const {
  useLazyGetPassedBiddersQuery,
  useLazyGetQualificationRequirementsByLotIdQuery,
  useLazyGetEqcQualificationQuery,
  useCreateTechnicalQualificationAssessmentMutation,
  useLazyGetCanQualificationCompleteQuery,
  useLazyGetQualificationAssessmentsQuery,
  useCompleteQualificationEvaluationMutation,
  useSubmitQualificationEvaluationMutation,
  useLazyGetQualificationMembersAssesmentQuery,
} = technicalQualification;
