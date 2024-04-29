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
          url: `/preliminary-compliance/opened-tenders${q}`,
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
          url: `/preliminary-compliance/bidders-status/${lotId}/${team}${q}`,
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
          url: `/preliminary-compliance/checklist-status/${lotId}/${bidderId}/${team}`,
        };
      },
      providesTags: ['bidAttribute'],
    }),
    checkBidAttribute: builder.mutation<any, any>({
      query: (data) => ({
        url: `/preliminary-compliance`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['bidAttribute'],
    }),
    getLotStatus: builder.query<any, any>({
      query: (lotId) => {
        return {
          url: `/preliminary-compliance/can-complete/${lotId}`,
          method: 'GET',
        };
      },
      providesTags: ['evaluation'],
    }),
    submitEvaluation: builder.mutation<any, any>({
      query: (data: { tenderId: string; isTeamLead: boolean }) => {
        return {
          url: `/preliminary-compliance/submit-checklist`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['evaluation'],
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
} = preliminaryComplianceApi;
