import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const tenderingApi = createApi({
  reducerPath: 'tenderingApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  tagTypes: ['opening', 'teams', 'teamMembers', 'bidAttribute'],
  endpoints: (builder) => ({
    getTenderDetail: builder.query<any, any>({
      query: (id: string) => `tenders/${id}`,
    }),
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

    getLotsByTenderId: builder.query<any, any>({
      query: ({
        tenderId,
        collectionQuery,
      }: {
        tenderId: string;
        collectionQuery: CollectionQuery;
      }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/lots/list/${tenderId}${q}`,
        };
      },
    }),
    getAllbiddersByTenderId: builder.query<any, any>({
      query: ({ tenderId, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/bid-registrations/submitted-bidders-by-tender-id/${tenderId}${q}`,
        };
      },
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
    createTeam: builder.mutation<any, any>({
      query: (data) => ({
        url: `/teams`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['teams'],
    }),
    getTeamsByTenderId: builder.query<any, any>({
      query: ({
        tenderId,
        collectionQuery,
      }: {
        tenderId: string;
        collectionQuery: CollectionQuery;
      }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `/teams/list/${tenderId}${q}` };
      },
      providesTags: ['teams'],
    }),

    createTeamMember: builder.mutation<any, any>({
      query: (data) => ({
        url: `/team-members/bulk-create-with-team`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['teamMembers'],
    }),

    getTeamMembers: builder.query<any, any>({
      query: (teamId) => `/team-members/list/${teamId}`,
      providesTags: ['teamMembers'],
    }),

    checkBidAttribute: builder.mutation<any, any>({
      query: (data) => ({
        url: `/bid-opening-checklist`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['bidAttribute'],
    }),
    completeOpening: builder.mutation<any, any>({
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
  }),
});

export const {
  useLazyGetClosedTendersQuery,
  useLazyGetOpeningByTenderIdQuery,
  useLazyGetLotsByTenderIdQuery,
  useLazyGetTenderDetailQuery,
  useLazyGetAllbiddersByTenderIdQuery,
  useLazyGetAllbiddersByLotIdQuery,
  useLazyGetBidOpeningChecklistByLotIdQuery,
  useOpenTenderMutation,
  useCreateTeamMutation,
  useLazyGetTeamsByTenderIdQuery,
  useCreateTeamMemberMutation,
  useLazyGetTeamMembersQuery,
  useCheckBidAttributeMutation,
  useCompleteOpeningMutation,
  useGetTenderOpeningStatusQuery,
  useGetOpeningMinutesQuery,
} = tenderingApi;
