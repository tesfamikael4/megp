import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const preBudgetPlanApi = createApi({
  reducerPath: 'preBudgetPlanApi',
  tagTypes: ['pr'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    approvePr: builder.mutation<any, any>({
      query: (data: { id: string; itemName: string }) => ({
        url: `procurement-requisition/initiate-workflow`,
        method: 'POST',
        body: { name: 'procurementApproval', ...data },
      }),
      invalidatesTags: ['pr'],
    }),
  }),
});

export const { useApprovePrMutation } = preBudgetPlanApi;
