import { adressApi } from '@/store/api/other/adress.api';

const organizationProfileApi = adressApi.injectEndpoints({
  endpoints: (builder) => ({
    inviteUser: builder.mutation<any, { id: string }>({
      query: (data) => ({
        url: `/user/invite`,
        method: 'POST',
        body: data,
      }),
    }),

    getUserInvitationLink: builder.query<any, any>({
      query: (id) => {
        return {
          url: `/user/invitation/${id}`,
          method: 'GET',
        };
      },
    }),
    setPassword: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `auth/reset-password`,
          method: 'POST',
          body: data,
        };
      },
    }),
  }),
});

export const {
  useInviteUserMutation,
  useLazyGetUserInvitationLinkQuery,
  useSetPasswordMutation,
} = organizationProfileApi;
