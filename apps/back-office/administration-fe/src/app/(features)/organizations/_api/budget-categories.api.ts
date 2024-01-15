import { BudgetCategory } from '@/models/budget-category';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const procurementMethodApi = entityApi.entitySliceApi['budget-categories'];

export const procurementMethodSliceApi: typeof EntitySliceApi =
  createEntitySlice<BudgetCategory>(
    procurementMethodApi as any,
    'budget-categories',
  );

export const {
  useLazyListQuery,
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useListByIdQuery,
} = procurementMethodSliceApi;
