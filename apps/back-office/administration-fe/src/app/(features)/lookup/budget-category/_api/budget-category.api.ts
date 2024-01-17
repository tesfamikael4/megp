import { BudgetCategory } from '@/models/budget-category';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const budgetCategoryApi = entityApi.entitySliceApi['budget-categories'];

export const budgetCategorySliceApi: typeof EntitySliceApi =
  createEntitySlice<BudgetCategory>(
    budgetCategoryApi as any,
    'budget-categories',
  );

export const {
  useListQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useListByIdQuery,
  useLazyListQuery,
} = budgetCategorySliceApi;
