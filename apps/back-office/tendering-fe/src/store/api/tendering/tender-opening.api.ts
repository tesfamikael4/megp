import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const tenderOpeningApi = createApi({
  reducerPath: 'tenderOpeningApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  tagTypes: ['bidAttribute', 'opening'],
  endpoints: (builder) => ({
    getClosedTenders: builder.query<any, any>({
      query: ({ collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `/opening/closed-tenders${q}`, method: 'GET' };
      },
    }),
    getOpeningByTenderId: builder.query<any, any>({
      query: (tenderId: string) => {
        return {
          url: `/opening/list/${tenderId}`,
        };
      },
      providesTags: ['opening'],
    }),
    getAllbiddersByLotId: builder.query<any, any>({
      query: ({ lotId, collectionQuery, team = 'member' }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/bid-opening-checklist/bidders-status/${lotId}/${team}${q}`,
        };
      },
    }),
    getBidOpeningChecklistByLotId: builder.query<any, any>({
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
          url: `/bid-opening-checklist/checklist-status/${lotId}/${bidderId}/${team}`,
        };
      },
      providesTags: ['bidAttribute'],
    }),
    openTender: builder.mutation<any, any>({
      query: (data) => ({
        url: `/opening`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['opening'],
    }),
    checkBidAttribute: builder.mutation<any, any>({
      query: (data) => ({
        url: `/bid-opening-checklist`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['bidAttribute'],
    }),
    submitOpening: builder.mutation<any, any>({
      query: (data: { tenderId: string; isTeamLead: boolean }) => {
        return {
          url: `/bid-opening-checklist/submit-checklist`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['opening'],
    }),
    getTenderOpeningStatus: builder.query<any, any>({
      query: (tenderId) => {
        return {
          url: `/bid-opening-checklist/can-complete/${tenderId}`,
          method: 'GET',
        };
      },
      providesTags: ['opening'],
    }),
    getOpeningMinutes: builder.query<any, any>({
      query: (tenderId) => `/bid-opening-checklist/opening-minutes/${tenderId}`,
    }),
    getOpeningAssessments: builder.query<any, any>({
      query: ({
        lotId,
        bidderId,
        team = 'member',
      }: {
        lotId: string;
        bidderId: string;
        team: string;
      }) => `/bid-opening-checklist/opener-report/${lotId}/${bidderId}/${team}`,
    }),
    completeOpening: builder.mutation<any, any>({
      query: (data: { tenderId: string; isTeamLead: boolean }) => {
        return {
          url: `/bid-opening-checklist/complete-checklist`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['opening'],
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
        `/bid-opening-checklist/members-report/${lotId}/${bidderId}/${checklistId}`,
    }),
  }),
});

export const {
  useCheckBidAttributeMutation,
  useSubmitOpeningMutation,
  useGetTenderOpeningStatusQuery,
  useGetOpeningMinutesQuery,
  useLazyGetAllbiddersByLotIdQuery,
  useLazyGetBidOpeningChecklistByLotIdQuery,
  useOpenTenderMutation,
  useLazyGetClosedTendersQuery,
  useLazyGetOpeningByTenderIdQuery,
  useLazyGetOpeningAssessmentsQuery,
  useLazyGetMembersAssesmentResultQuery,
} = tenderOpeningApi;
