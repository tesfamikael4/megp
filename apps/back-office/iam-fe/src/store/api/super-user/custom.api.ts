import type { CollectionQuery } from '@megp/entity';
import { encodeCollectionQuery } from '@megp/entity';

import { invitationApi } from '@/store/api/other/invitation.api';

const organizationProfileApi = invitationApi.injectEndpoints({
  endpoints: (builder) => ({
    inviteUser: builder.mutation<any, { id: string }>({
      query: (data) => ({
        url: `/user/invite`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['invitation'],
    }),

    getUserInvitationLink: builder.query<any, any>({
      query: (id) => {
        return {
          url: `/user/invitation/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['invitation'],
    }),

    setPassword: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `auth/set-password`,
          method: 'POST',
          body: data,
        };
      },
    }),
    roleToAssign: builder.query<
      any,
      { id: string; collectionQuery: CollectionQuery | undefined }
    >({
      query: ({ id, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }

        return {
          url: `roles/list/${id}/assignment${q}`,
          method: 'GET',
        };
      },
    }),

    createSuperUser: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `user/create-super-admin`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['users'],
    }),
    updateSuperUser: builder.mutation<any, any>({
      query: ({ id, ...data }) => {
        return {
          url: `/auth/update-account/${id}`,
          method: 'PATCH',
          body: data,
        };
      },
      invalidatesTags: ['users'],
    }),
    listSuperUser: builder.query<
      any,
      { id: string; collectionQuery: CollectionQuery | undefined }
    >({
      query: ({ id, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `user/list/${id}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['users'],
    }),
    readSuperUser: builder.query<any, string>({
      query: (id) => {
        return {
          url: `/user/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['users'],
    }),
    deleteSuperUser: builder.mutation<any, string>({
      query: (id) => {
        return {
          url: `/user/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['users'],
    }),
    updateStatus: builder.mutation<any, any>({
      query: ({ id, ...data }) => {
        return {
          url: `/user/${id}`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['users'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useInviteUserMutation,
  useUpdateStatusMutation,
  useUpdateSuperUserMutation,
  useDeleteSuperUserMutation,
  useListSuperUserQuery,
  useLazyListSuperUserQuery,
  useReadSuperUserQuery,
  useCreateSuperUserMutation,
  useLazyGetUserInvitationLinkQuery,
  useSetPasswordMutation,
  useLazyRoleToAssignQuery,
  useRoleToAssignQuery,
} = organizationProfileApi;
