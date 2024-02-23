import { AnnualProcurementPlan } from '@/models/annual-procurement-plan';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const postBudgetPlanActivitiesApi =
  entityApi.entitySliceApi['post-budget-plan-activities'];

export const postBudgetPlanActivitiesSliceApi: typeof EntitySliceApi =
  createEntitySlice<AnnualProcurementPlan>(
    postBudgetPlanActivitiesApi as any,
    'post-budget-plan-activities',
  );

export const {
  useListQuery,
  useListByAppIdQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = postBudgetPlanActivitiesSliceApi;
