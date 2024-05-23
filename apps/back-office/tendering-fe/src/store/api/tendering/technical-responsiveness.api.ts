import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const technicalResponsiveness = createApi({
  reducerPath: 'technicalResponsiveness',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  tagTypes: ['evaluation', 'bidAttribute', 'bidder'],
  endpoints: (builder) => ({
    getPassedBidders: builder.query<any, any>({
      query: ({ lotId, itemId, collectionQuery, team = 'member' }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/technical-responsiveness-assessment-detail/bidders-status/${lotId}/${itemId}/${team}${q}`,
        };
      },
    }),
    getResponsivenessRequirementsByLotId: builder.query<any, any>({
      query: ({
        lotId,
        bidderId,
        itemId,
        team = 'member',
      }: {
        lotId: string;
        itemId: string;
        bidderId: string;
        team: string;
      }) => {
        return {
          url: `/technical-responsiveness-assessment-detail/checklist-status/${lotId}/${itemId}/${bidderId}/${team}`,
        };
      },
      providesTags: ['bidAttribute'],
    }),

    getSorTechnicalRequirements: builder.query<any, any>({
      query: (spdId) => `/sor-technical-requirements/${spdId}`,
    }),
    createTechnicalResponsivenessAssessment: builder.mutation<any, any>({
      query: (data) => ({
        url: `/technical-responsiveness-assessment-detail`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['bidAttribute'],
    }),
    getResponsivenessAssessments: builder.query<any, any>({
      query: ({
        lotId,
        bidderId,
        itemId,
        team = 'member',
      }: {
        lotId: string;
        bidderId: string;
        itemId: string;
        team: string;
      }) =>
        `/technical-responsiveness-assessment-detail/evaluator-report/${lotId}/${itemId}/${bidderId}/${team}`,
    }),
    completeResponsivenessEvaluation: builder.mutation<any, any>({
      query: (data: {
        lotId: string;
        bidderId: string;
        isTeamLead: boolean;
      }) => {
        return {
          url: `/technical-responsiveness-assessment-detail/complete-bidder-evaluation`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['evaluation', 'bidder'],
    }),
    getCanResponsivenessComplete: builder.query<any, any>({
      query: (lotId) => {
        return {
          url: `/technical-responsiveness-assessment-detail/can-complete/${lotId}`,
          method: 'GET',
        };
      },
      providesTags: ['evaluation', 'bidder'],
    }),
    submitResponsivenessEvaluation: builder.mutation<any, any>({
      query: (data: { tenderId: string; isTeamLead: boolean }) => {
        return {
          url: `/technical-responsiveness-assessment-detail/submit-checklist`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['evaluation'],
    }),
    getResponsivenessMembersAssessmentResult: builder.query<any, any>({
      query: ({
        lotId,
        bidderId,
        requirementId,
        itemId,
      }: {
        lotId: string;
        bidderId: string;
        requirementId: string;
        itemId: string;
      }) =>
        `/technical-responsiveness-assessment-detail/members-report/${lotId}/${itemId}/${bidderId}/${requirementId}`,
    }),
    getItems: builder.query<any, any>({
      query: ({
        lotId,
        collectionQuery,
      }: {
        lotId: string;
        collectionQuery?: CollectionQuery;
      }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/technical-responsiveness-assessment-detail/get-items-by-lotId/${lotId}${q}`,
        };
      },
    }),
  }),
});

export const {
  useLazyGetPassedBiddersQuery,
  useLazyGetResponsivenessRequirementsByLotIdQuery,
  useLazyGetSorTechnicalRequirementsQuery,
  useCreateTechnicalResponsivenessAssessmentMutation,
  useLazyGetCanResponsivenessCompleteQuery,
  useLazyGetResponsivenessAssessmentsQuery,
  useCompleteResponsivenessEvaluationMutation,
  useSubmitResponsivenessEvaluationMutation,
  useLazyGetResponsivenessMembersAssessmentResultQuery,
  useLazyGetItemsQuery,
} = technicalResponsiveness;
