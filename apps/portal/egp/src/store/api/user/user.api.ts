import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '@/models/user';
import { baseQuery } from '@/store/base-query';

export const userApi = createApi({
  reducerPath: 'userApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_IAM_API ?? 'iam/api'),
  endpoints: (builder) => ({
    changeEmail: builder.mutation<any, { newEmail: string }>({
      query: (data) => ({
        url: `/auth/change-email-request`,
        method: 'POST',
        body: data,
      }),
    }),
    confirmOldEmail: builder.mutation<
      any,
      { verificationId: string; otp: string; isOtp: boolean }
    >({
      query: (data) => ({
        url: `/auth/confirm-old-email`,
        method: 'POST',
        body: data,
      }),
    }),
    confirmNewEmail: builder.mutation<
      any,
      { verificationId: string; otp: string; isOtp: boolean }
    >({
      query: (data) => ({
        url: `/auth/confirm-new-email`,
        method: 'POST',
        body: data,
      }),
    }),
    requestConfirmPhone: builder.mutation<any, {}>({
      query: (data) => ({
        url: `/auth/request-confirm-phone`,
        method: 'POST',
      }),
    }),
    confirmPhone: builder.mutation<
      any,
      { verificationId: string; otp: string; isOtp: boolean }
    >({
      query: (data) => ({
        url: `/auth/request-confirm-phone`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useChangeEmailMutation,
  useConfirmOldEmailMutation,
  useConfirmNewEmailMutation,
  useRequestConfirmPhoneMutation,
  useConfirmPhoneMutation,
} = userApi;
