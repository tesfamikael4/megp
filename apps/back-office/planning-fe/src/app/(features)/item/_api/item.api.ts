import { Item } from '@/models/item';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const itemApi = entityApi.entitySliceApi['prebudget-items'];

export const itemSliceApi: typeof EntitySliceApi = createEntitySlice<Item>(
  itemApi as any,
  'prebudget-items',
);

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = itemSliceApi;
