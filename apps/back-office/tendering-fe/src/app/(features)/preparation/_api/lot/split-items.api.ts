import { Lot } from '@/models/tender/lot';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base item api
const itemApi = entityApi.entitySliceApi['lots/split-items'];

export const SplitItemsSliceApi: typeof EntitySliceApi = createEntitySlice<Lot>(
  itemApi,
  'lots/split-items',
);

export const { useCreateMutation, useUpdateMutation, useDeleteMutation } =
  SplitItemsSliceApi;
