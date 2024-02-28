import { invitationApi } from '@/store/api/other/invitation.api';

const organizationProfileApi = invitationApi.injectEndpoints({
  endpoints: (builder) => ({
    setPassword: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `auth/change-password`,
          method: 'POST',
          body: data,
        };
      },
    }),
  }),
});

export const { useSetPasswordMutation } = organizationProfileApi;
