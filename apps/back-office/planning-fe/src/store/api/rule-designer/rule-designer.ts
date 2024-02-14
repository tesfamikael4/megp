import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const ruleApi = createApi({
  reducerPath: 'ruleApi',
  tagTypes: [''],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    'https://dev-bo.megp.peragosystems.com/infrastructure/api/',
    // process.env.NEXT_PUBLIC_PLANNING_API ?? '/infrastructure/api/',
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
    validateTargetGroup: builder.mutation<any, any>({
      query: (data) => ({
        url: `rule-designer/bulk-validate`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useValidateProcurementMethodMutation,
  useValidateTargetGroupMutation,
} = ruleApi;
