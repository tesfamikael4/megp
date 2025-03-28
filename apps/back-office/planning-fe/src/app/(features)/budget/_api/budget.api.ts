import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const budgetApi = entityApi.entitySliceApi['budgets'];

export const budgetSliceApi: typeof EntitySliceApi = createEntitySlice<any>(
  budgetApi as any,
  'budgets',
);

export const {
  useListQuery,
  useReadQuery,
  useLazyReadQuery,
  useListByAppIdQuery,
  useLazyListByAppIdQuery,
  useLazyListByIdQuery,
  useLazyListQuery,
} = budgetSliceApi;
