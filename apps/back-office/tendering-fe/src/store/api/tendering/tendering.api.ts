import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const tenderingApi = createApi({
  reducerPath: 'tenderingApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  tagTypes: ['opening', 'teams', 'teamMembers', 'bidAttribute'],
  endpoints: (builder) => ({
    getTenders: builder.query<any, any>({
      query: ({ collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `/tenders${q}`, method: 'GET' };
      },
    }),
    getTenderDetail: builder.query<any, any>({
      query: (id: string) => `opening/get-tender-detail/${id}`,
    }),
    getLotDetail: builder.query<any, any>({
      query: ({ tenderId, lotId }: { tenderId: string; lotId: string }) =>
        `opening/get-lot-detail/${tenderId}/${lotId}`,
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

    getBidderDetails: builder.query<any, any>({
      query: ({
        tenderId,
        lotId,
        bidderId,
      }: {
        tenderId: string;
        lotId: string;
        bidderId: string;
      }) => `/opening/get-bidder-detail/${tenderId}/${lotId}/${bidderId}`,
    }),
  }),
});

export const {
  useLazyGetLotsByTenderIdQuery,
  useLazyGetTenderDetailQuery,
  useLazyGetAllbiddersByTenderIdQuery,
  useLazyGetLotDetailQuery,
  useLazyGetBidderDetailsQuery,

  useCreateTeamMutation,
  useLazyGetTeamsByTenderIdQuery,
  useCreateTeamMemberMutation,
  useLazyGetTeamMembersQuery,

  useLazyGetTendersQuery,
} = tenderingApi;
