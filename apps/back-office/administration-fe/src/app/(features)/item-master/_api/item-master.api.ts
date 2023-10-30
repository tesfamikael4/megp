import { ItemMaster } from '@/models/item-master';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const itemMasterApi = entityApi.entitySliceApi['item-masters'];

export const itemMasterSliceApi: typeof EntitySliceApi =
  createEntitySlice<ItemMaster>(itemMasterApi as any, 'item-masters');

export const {
  useListQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = itemMasterSliceApi;
