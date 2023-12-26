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
  }),
});

export const {
  useInviteUserMutation,
  useLazyGetUserInvitationLinkQuery,
  useSetPasswordMutation,
  useLazyRoleToAssignQuery,
  useRoleToAssignQuery,
} = organizationProfileApi;
