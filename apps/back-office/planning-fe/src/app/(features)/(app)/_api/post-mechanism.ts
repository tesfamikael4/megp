import { AnnualProcurementPlan } from '@/models/annual-procurement-plan';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const postProcurementMechanismApi =
  entityApi.entitySliceApi['post-procurement-mechanism'];

export const postProcuremenetMechanismSliceApi: typeof EntitySliceApi =
  createEntitySlice<AnnualProcurementPlan>(
    postProcurementMechanismApi as any,
    'post-procurement-mechanism',
  );

export const {
  useListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = postProcuremenetMechanismSliceApi;
