import { AnnualProcurementPlan } from '@/models/annual-procurement-plan';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const annualProcurementPlanApi = entityApi.entitySliceApi['apps'];

export const annualProcurementPlanSliceApi: typeof EntitySliceApi =
  createEntitySlice<AnnualProcurementPlan>(
    annualProcurementPlanApi as any,
    'apps',
  );

export const {
  useListQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = annualProcurementPlanSliceApi;
