import { BidSecurity } from '@/models/bidSecurity';
import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
const URL =
  process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/';
export const guaranteeApi = createApi({
  reducerPath: 'guaranteeApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    submitRequest: builder.mutation<BidSecurity, any>({
      query: (body) => {
        return {
          url: `guarantees`,
          method: 'POST',
          body: body,
        };
      },
    }),
    getGuarantee: builder.query<any, any>({
      query: () => `guarantees`,
    }),
    read: builder.query<BidSecurity, string>({
      query: (id) => `guarantees/${id}`,
    }),
  }),
});

export const {
  useSubmitRequestMutation,
  useLazyGetGuaranteeQuery,
  useGetGuaranteeQuery,
  useReadQuery,
  useLazyReadQuery,
} = guaranteeApi;
