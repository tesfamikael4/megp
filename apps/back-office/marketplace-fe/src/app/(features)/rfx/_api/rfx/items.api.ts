import { Item } from '@/models/tender/item';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base item api
const itemApi = entityApi.entitySliceApi['rfx-items'];

export const itemSliceApi: typeof EntitySliceApi = createEntitySlice<Item>(
  itemApi,
  'rfx-items',
);

export const {
  useListQuery,
  useListByIdQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = itemSliceApi;
