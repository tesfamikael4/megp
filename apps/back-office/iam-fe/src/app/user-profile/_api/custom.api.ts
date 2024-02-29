import type { CollectionQuery } from '@megp/entity';
import { encodeCollectionQuery } from '@megp/entity';

import { invitationApi } from '@/store/api/other/invitation.api';

const organizationProfileApi = invitationApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `auth/change-password`,
          method: 'POST',
          body: data,
        };
      },
    }),
    resetPassword: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/api/auth/reset-password-back-office`,
          method: 'POST',
          body: data,
        };
      },
    }),
    getProfile: builder.query<
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

    getUserProfile: builder.query<any, any>({
      query: () => {
        return {
          url: `auth/account-profile`,
          method: 'GET',
        };
      },
    }),
    updateProfile: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/auth/update-account-profile`,
          method: 'POST',
          body: data,
        };
      },
    }),
  }),
});

export const {
  useChangePasswordMutation,
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useUpdateProfileMutation,
} = organizationProfileApi;
