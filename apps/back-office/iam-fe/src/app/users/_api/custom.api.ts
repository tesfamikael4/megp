import type { CollectionQuery } from '@megp/entity';
import { encodeCollectionQuery } from '@megp/entity';

import { invitationApi } from '@/store/api/other/invitation.api';
import { logger } from '@megp/core-fe';

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
        logger.log(id);

        return {
          url: `roles/list/${id}/assignment${q}`,
          method: 'GET',
        };
      },
    }),
    updateSuperUser: builder.mutation<any, any>({
      query: ({ id, ...data }) => {
        return {
          url: `/auth/update-account/${id}`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['users'],
    }),
    resetPassword: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/auth/reset-account-password`,
          method: 'POST',
          body: data,
        };
      },
    }),

    createUser: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `user/create-super-admin`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['users'],
    }),
    updateUser: builder.mutation<any, any>({
      query: ({ id, ...data }) => {
        return {
          url: `/auth/update-account/${id}`,
          method: 'PATCH',
          body: data,
        };
      },
      invalidatesTags: ['users'],
    }),
    listUser: builder.query<
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
    deleteUser: builder.mutation<any, string>({
      query: (id) => {
        return {
          url: `/user/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['users'],
    }),
  }),
});

export const {
  useInviteUserMutation,
  useResetPasswordMutation,
  useUpdateSuperUserMutation,
  useLazyGetUserInvitationLinkQuery,
  useSetPasswordMutation,
  useLazyRoleToAssignQuery,
  useRoleToAssignQuery,

  useCreateUserMutation,
  useUpdateUserMutation,
  useLazyListUserQuery,
  useListUserQuery,
  useDeleteUserMutation,
} = organizationProfileApi;
