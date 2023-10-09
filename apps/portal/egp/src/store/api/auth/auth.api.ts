import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Password } from '@/models/auth';
import { getCookie } from 'cookies-next';

function getBearerToken() {
  const accessToken = getCookie('st-access-token');
  return accessToken;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env['NEXT_PUBLIC_AUTH_API']!,
    prepareHeaders(headers) {
      const token = getBearerToken();
      if (token) {
        // Attach the bearer token to the request headers.
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: () => ({
        url: 'auth/userinfo',
        method: 'GET',
      }),
    }),
    changePassword: builder.mutation<Password, Password>({
      query: ({ oldPassword, newPassword }) => ({
        url: 'auth/change-password',
        method: 'POST',
        body: { oldPassword, newPassword },
      }),
    }),
    setSecurityQuestions: builder.mutation({
      query: ({ questions }) => ({
        url: 'auth/set-security-questions',
        method: 'POST',
        body: { questions },
      }),
    }),
    checkSecurityQuestions: builder.mutation({
      query: ({ questions, username }) => ({
        url: 'auth/check-security-questions',
        method: 'POST',
        body: { questions, username },
      }),
    }),
    changePassWithQue: builder.mutation({
      query: ({
        superTokenUserId,
        token,
        password,
      }: {
        superTokenUserId: string;
        token: string;
        password: string;
      }) => ({
        url: 'auth/password-reset',
        method: 'POST',
        body: { superTokenUserId, token, password },
      }),
    }),
  }),
});

export const {
  useLazyGetUserInfoQuery,
  useChangePasswordMutation,
  useSetSecurityQuestionsMutation,
  useCheckSecurityQuestionsMutation,
  useChangePassWithQueMutation,
} = authApi;
