import { BidSecurity } from '@/models/bidSecurity';
import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
const URL = process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/';
export const guaranteeApi = createApi({
  reducerPath: 'guaranteeApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    saveRequest: builder.mutation<BidSecurity, any>({
      query: (body) => {
        return {
          url: `bid-guarantees`,
          method: 'POST',
          body: body,
        };
      },
    }),
    updateRequest: builder.mutation<BidSecurity, any>({
      query: ({ id, ...data }) => {
        return {
          url: `bid-guarantees/${id}`,
          method: 'PUT',
          body: data,
        };
      },
    }),
    submitRequest: builder.mutation<BidSecurity, any>({
      query: ({ id, ...data }) => {
        return {
          url: `bid-guarantees/update-status/${id}`,
          method: 'PUT',
          body: data,
        };
      },
    }),
    getGuarantees: builder.query<any, any>({
      query: (id) => `bid-guarantees/list/${id}`,
    }),
    getGuarantee: builder.query<any, any>({
      query: (id) => `bid-guarantees/${id}`,
    }),
    read: builder.query<BidSecurity, string>({
      query: (id) => `bid-guarantees/${id}`,
    }),
  }),
});

export const {
  useSaveRequestMutation,
  useUpdateRequestMutation,
  useSubmitRequestMutation,
  useLazyGetGuaranteesQuery,
  useGetGuaranteesQuery,
  useGetGuaranteeQuery,
  useReadQuery,
  useLazyReadQuery,
} = guaranteeApi;
