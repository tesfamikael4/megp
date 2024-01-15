import { OrganazationBudgetCategory } from '@/models/organazation-budget-category';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization api
const BudgetCategoryApi =
  entityApi.entitySliceApi['organization-budget-category'];

export const BudgetSliceApi: typeof EntitySliceApi = createEntitySlice<any>(
  BudgetCategoryApi as any,
  'organization-budget-category/bulk-create',
);

export const {
  useListQuery,
  useRelationMutation,
  useLazySecondRelationQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useListByIdQuery,
  useLazyListByIdQuery,
  useLazyListArchivedByIdQuery,
  useRestoreMutation,
} = BudgetSliceApi;
