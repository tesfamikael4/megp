import { Lot } from '@/models/tender/lot';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base lot api
const lotApi = entityApi.entitySliceApi['lots'];

export const lotSliceApi: typeof EntitySliceApi = createEntitySlice<Lot>(
  lotApi,
  'lots',
);

export const {
  useListQuery,
  useLazyListByIdQuery,
  useLazyListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = lotSliceApi;
