import { AnnualProcurementPlan } from '@/models/annual-procurement-plan';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const itemsApi = entityApi.entitySliceApi['pre-budget-plan-items'];

export const itemsSliceApi: typeof EntitySliceApi =
  createEntitySlice<AnnualProcurementPlan>(
    itemsApi as any,
    'pre-budget-plan-items',
  );

export const {
  useListQuery,
  useListByAppIdQuery,
  useLazyListByIdQuery,
  useLazyListByAppIdQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = itemsSliceApi;
