import { OrganazationBudgetCategory } from '@/models/organazation-budget-category';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const budgeCategoryApi = createApi({
  reducerPath: 'budegeCategoryApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  }),
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
  }),
});

export const {
  useAssignBudgetToOrganizationMutation,
  useGetBudgetCategoriesQuery,
  useLazyGetBudgetCategoriesQuery,
} = budgeCategoryApi;
