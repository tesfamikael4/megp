import { ProcurementRequisition } from '@/models/procurement-requsition';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization api
const userApi = entityApi.entitySliceApi['user'];

export const userSliceApi: typeof EntitySliceApi =
  createEntitySlice<ProcurementRequisition>(userApi as any, 'user');

export const {
  useListByIdQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListArchivedQuery,
  useRestoreMutation,
} = userSliceApi;
