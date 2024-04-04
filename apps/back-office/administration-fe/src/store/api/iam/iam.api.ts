import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const iamApi = createApi({
  reducerPath: 'iamApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api/'),
  tagTypes: ['ipdcMembers', 'adhocMembers', 'iPDC', 'adhoc-team'],
  endpoints: (builder) => ({
    getUnits: builder.query<any, any>({
      query: ({ organizationId, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `unit/list/${organizationId}${q}` };
      },
    }),
    getUsers: builder.query<any, any>({
      query: ({ organizationId, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `user/list/${organizationId}${q}` };
      },
    }),
    createIpdcMembers: builder.mutation<any, any>({
      query: (data) => ({
        url: `ipdc-member/bulk-create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ipdcMembers'],
    }),
    createAdhocMembers: builder.mutation<any, any>({
      query: (data) => ({
        url: `adhoc-team-member/bulk-create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['adhocMembers'],
    }),
    updateIpdcStatus: builder.mutation<any, any>({
      query: (data) => ({
        url: `ipdc/change-status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['iPDC'],
    }),
    updateAdhocStatus: builder.mutation<any, any>({
      query: (data) => ({
        url: `adhoc-team/change-status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['adhoc-team'],
    }),

    getIpdcMembers: builder.query<any, any>({
      query: ({ id }: { id: string }) => {
        return { url: `ipdc-member/find-all-ipdc-members/${id}` };
      },
      providesTags: ['ipdcMembers'],
    }),

    getAdhocMembers: builder.query<any, any>({
      query: ({ id }: { id: string }) => {
        return { url: `adhoc-team-member/find-all-adhoc-members/${id}` };
      },
      providesTags: ['adhocMembers'],
    }),
  }),
});

export const {
  useLazyGetUnitsQuery,
  useLazyGetUsersQuery,
  useCreateIpdcMembersMutation,
  useCreateAdhocMembersMutation,
  useLazyGetIpdcMembersQuery,
  useLazyGetAdhocMembersQuery,
  useUpdateAdhocStatusMutation,
  useUpdateIpdcStatusMutation,
} = iamApi;
