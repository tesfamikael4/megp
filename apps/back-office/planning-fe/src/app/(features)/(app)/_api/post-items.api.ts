import { AnnualProcurementPlan } from '@/models/annual-procurement-plan';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const itemsApi = entityApi.entitySliceApi['post-budget-plan-items'];

export const itemsSliceApi: typeof EntitySliceApi =
  createEntitySlice<AnnualProcurementPlan>(
    itemsApi as any,
    'post-budget-plan-items',
  );

export const {
  useListQuery,
  useListByAppIdQuery,
  useLazyListByAppIdQuery,
  useReadQuery,
  useLazyReadQuery,
  useLazyListByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = itemsSliceApi;
