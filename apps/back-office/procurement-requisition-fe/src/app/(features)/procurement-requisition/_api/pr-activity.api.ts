import { ProcurementRequisition } from '@/models/procurement-requsition';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const prActivityApi =
  entityApi.entitySliceApi['procurement-requisition-activities'];

export const prActivitySliceApi: typeof EntitySliceApi =
  createEntitySlice<ProcurementRequisition>(
    prActivityApi as any,
    'procurement-requisition-activities',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useListByIdQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListArchivedQuery,
  useRestoreMutation,
} = prActivitySliceApi;
