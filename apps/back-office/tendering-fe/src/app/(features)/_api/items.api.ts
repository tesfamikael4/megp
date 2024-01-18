import { ProcurementRequisition } from '@/models/procurement-requsition';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const itemsApi = entityApi.entitySliceApi['procurement-requisition-items'];

export const itemsSliceApi: typeof EntitySliceApi =
  createEntitySlice<ProcurementRequisition>(
    itemsApi as any,
    'procurement-requisition-items',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useLazyListByAppIdQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListArchivedQuery,
  useRestoreMutation,
} = itemsSliceApi;
