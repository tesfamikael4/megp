import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const poItemApi = entityApi.entitySliceApi['purchase-orders'];

export const poItemSliceApi: typeof EntitySliceApi = createEntitySlice<any>(
  poItemApi,
  'purchase-orders',
);

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = poItemSliceApi;
