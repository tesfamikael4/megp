import { ProcurementRequisition } from '@/models/procurement-requsition';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization api
const requisitionerApi =
  entityApi.entitySliceApi['procurement-requisition-officer-assignments'];

export const requisitionerSliceApi: typeof EntitySliceApi =
  createEntitySlice<ProcurementRequisition>(
    requisitionerApi as any,
    'procurement-requisition-officer-assignments',
  );

export const {
  useListByIdQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListArchivedQuery,
  useRestoreMutation,
} = requisitionerSliceApi;
