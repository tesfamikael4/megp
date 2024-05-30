import { Item } from '@/models/tender/lot/item';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base item api
const itemApi = entityApi.entitySliceApi['items'];

export const itemSliceApi: typeof EntitySliceApi = createEntitySlice<Item>(
  itemApi,
  'items',
);

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = itemSliceApi;
