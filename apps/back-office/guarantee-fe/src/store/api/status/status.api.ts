import { GuaranteeRequest } from '@/models/guarantee-request';
import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
const URL =
  process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/';
export const statusApi = createApi({
  reducerPath: 'statusApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    changeStatus: builder.mutation<GuaranteeRequest, any>({
      query: ({ id, ...data }) => {
        return {
          url: `guarantees/update-status/${id}`,
          method: 'PUT',
          body: data,
        };
      },
    }),
    preSignedUrl: builder.mutation<any, any>({
      query: (data) => ({
        url: 'guarantees',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useChangeStatusMutation, usePreSignedUrlMutation } = statusApi;
