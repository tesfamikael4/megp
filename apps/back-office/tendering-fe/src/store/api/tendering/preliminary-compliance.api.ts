import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const preliminaryComplianceApi = createApi({
  reducerPath: 'preliminaryComplianceApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  tagTypes: ['evaluation', 'bidAttribute'],
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
    getPreliminaryChecklistByLotId: builder.query<any, any>({
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
    checkBidAttribute: builder.mutation<any, any>({
      query: (data) => ({
        url: `/technical-preliminary-assessment-detail`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['bidAttribute'],
    }),
    getLotStatus: builder.query<any, any>({
      query: (lotId) => {
        return {
          url: `/technical-preliminary-assessment-detail/can-complete/${lotId}`,
          method: 'GET',
        };
      },
      providesTags: ['evaluation'],
    }),
    submitEvaluation: builder.mutation<any, any>({
      query: (data: { tenderId: string; isTeamLead: boolean }) => {
        return {
          url: `/technical-preliminary-assessment-detail/submit-checklist`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['evaluation'],
    }),
    getMembersAssesmentResult: builder.query<any, any>({
      query: ({
        lotId,
        bidderId,
        checklistId,
      }: {
        lotId: string;
        bidderId: string;
        checklistId: string;
      }) =>
        `/technical-preliminary-assessment-detail/members-report/${lotId}/${bidderId}/${checklistId}`,
    }),
  }),
});

export const {
  useLazyGetOpenedTendersQuery,
  useLazyGetPassedBiddersQuery,
  useLazyGetPreliminaryChecklistByLotIdQuery,
  useCheckBidAttributeMutation,
  useGetLotStatusQuery,
  useSubmitEvaluationMutation,
  useLazyGetMembersAssesmentResultQuery,
} = preliminaryComplianceApi;
