import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const registrationApi = createApi({
  reducerPath: 'registrationApi',
  tagTypes: ['registration'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    registration: builder.mutation<any, any>({
      query: (data: { tenderId: string }) => ({
        url: `bid-registrations`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['registration'],
    }),
  }),
});

export const { useRegistrationMutation } = registrationApi;
