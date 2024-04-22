import { ItemSubCategory } from '@/models/item-sub-category';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const itemSubCategoryApi = entityApi.entitySliceApi['item-sub-category'];

export const itemSubCategorySliceApi: typeof EntitySliceApi =
  createEntitySlice<ItemSubCategory>(
    itemSubCategoryApi as any,
    'item-sub-category',
  );

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
} = itemSubCategorySliceApi;
