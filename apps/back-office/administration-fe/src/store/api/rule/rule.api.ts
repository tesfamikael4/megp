import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';

export const ruleDesignerApi = createApi({
  reducerPath: 'ruleDesignerApi',
  tagTypes: ['Rules'],
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_INFRASTRUCTURE_API ?? 'infrastructure/api',
  ),
  endpoints: (builder) => ({
    getRules: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `rule-designers${q}`, method: 'GET' };
      },
      providesTags: ['Rules'],
    }),
    addRules: builder.mutation<any, any>({
      query: (data) => ({
        url: `/rule-designers`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Rules'],
    }),
    updateRules: builder.mutation<any, any>({
      query: (data) => ({
        url: `/rule-designers/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Rules'],
    }),
    deleteRule: builder.mutation<any, { id: string }>({
      query: (data) => ({
        url: `/rules/${data.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Rules'],
    }),
  }),
});

export const {
  useAddRulesMutation,
  useUpdateRulesMutation,
  useLazyGetRulesQuery,
  useDeleteRuleMutation,
} = ruleDesignerApi;
