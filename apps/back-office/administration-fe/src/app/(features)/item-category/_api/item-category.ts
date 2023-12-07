import { ItemCategory } from '@/models/item-category';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const itemCategoryApi = entityApi.entitySliceApi['item-categories'];

export const itemCategorySliceApi: typeof EntitySliceApi =
  createEntitySlice<ItemCategory>(itemCategoryApi as any, 'item-categories');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
} = itemCategorySliceApi;
