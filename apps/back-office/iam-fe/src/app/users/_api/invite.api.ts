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
  }),
});

export const {
  useInviteUserMutation,
  useLazyGetUserInvitationLinkQuery,
  useSetPasswordMutation,
} = organizationProfileApi;
