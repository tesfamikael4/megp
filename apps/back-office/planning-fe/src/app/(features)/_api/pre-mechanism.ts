import { AnnualProcurementPlan } from '@/models/annual-procurement-plan';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const preProcurementMechanismApi =
  entityApi.entitySliceApi['pre-procurement-mechanism'];

export const preProcuremenetMechanismSliceApi: typeof EntitySliceApi =
  createEntitySlice<AnnualProcurementPlan>(
    preProcurementMechanismApi as any,
    'pre-procurement-mechanism',
  );

export const {
  useListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = preProcuremenetMechanismSliceApi;
