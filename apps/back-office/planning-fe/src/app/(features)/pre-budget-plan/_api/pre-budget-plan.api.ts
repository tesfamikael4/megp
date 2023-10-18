import { PreBudgetPlan } from '@/models/pre-budget-plan';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const preBudgetPlanApi = entityApi.entitySliceApi['prebudget-plans'];

export const preBudgetPlanSliceApi: typeof EntitySliceApi =
  createEntitySlice<PreBudgetPlan>(preBudgetPlanApi as any, 'prebudget-plans');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = preBudgetPlanSliceApi;
