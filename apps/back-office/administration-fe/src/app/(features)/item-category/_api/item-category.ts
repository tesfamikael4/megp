import { ItemCategory } from '@/models/item-category';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const itemCategoryApi = entityApi.entitySliceApi['item-Categories'];

export const itemCategorySliceApi: typeof EntitySliceApi =
  createEntitySlice<ItemCategory>(itemCategoryApi as any, 'item-Categories');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
} = itemCategorySliceApi;
