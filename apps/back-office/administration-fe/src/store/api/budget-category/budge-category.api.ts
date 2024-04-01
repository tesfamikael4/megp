import { OrganazationBudgetCategory } from '@/models/organazation-budget-category';
import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const budgeCategoryApi = createApi({
  reducerPath: 'budegeCategoryApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  ),
  endpoints: (builder) => ({
    assignBudgetToOrganization: builder.mutation<
      any,
      OrganazationBudgetCategory
    >({
      query: (data) => {
        return {
          url: `organization-budget-category/bulk-create`,
          method: 'POST',
          body: data,
        };
      },
    }),
    getBudgetCategories: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `organization-budget-category/${id}`,
      }),
    }),
    getOrgType: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `organization-type/${id}`,
      }),
    }),
  }),
});

export const {
  useAssignBudgetToOrganizationMutation,
  useGetBudgetCategoriesQuery,
  useLazyGetBudgetCategoriesQuery,
  useGetOrgTypeQuery,
  useLazyGetOrgTypeQuery,
} = budgeCategoryApi;
