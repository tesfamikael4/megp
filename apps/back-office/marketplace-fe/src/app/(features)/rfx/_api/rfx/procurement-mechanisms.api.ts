import { ProcurementMechanism } from '@/models/tender/evaluation-mechanism';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const ProcurementMechanismsApi =
  entityApi.entitySliceApi['procurement-mechanisms'];

export const ProcurementMechanismsSliceApi: typeof EntitySliceApi =
  createEntitySlice<ProcurementMechanism>(
    ProcurementMechanismsApi as any,
    'procurement-mechanisms',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = ProcurementMechanismsSliceApi;
