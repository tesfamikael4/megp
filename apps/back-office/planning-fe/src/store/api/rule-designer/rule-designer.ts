import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const ruleApi = createApi({
  reducerPath: 'ruleApi',
  tagTypes: [''],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_PLANNING_API ?? '/infrastructure/api/',
    // 'https://f30xs3hk-7000.euw.devtunnels.ms/api/',
  ),
  endpoints: (builder) => ({
    validateProcurementMethod: builder.mutation<any, any>({
      query: (data: { data: any; key: string }) => ({
        url: `rule-designer/validate/${data.key}`,
        method: 'POST',
        body: data.data,
      }),
    }),
  }),
});

export const { useValidateProcurementMethodMutation } = ruleApi;
