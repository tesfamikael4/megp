import { AnnualProcurementPlan } from '@/models/annual-procurement-plan';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const preBudgetPlanActivitiesApi =
  entityApi.entitySliceApi['pre-budget-plan-activities'];

export const preBudgetPlanActivitiesSliceApi: typeof EntitySliceApi =
  createEntitySlice<AnnualProcurementPlan>(
    preBudgetPlanActivitiesApi as any,
    'pre-budget-plan-activities',
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
} = preBudgetPlanActivitiesSliceApi;
