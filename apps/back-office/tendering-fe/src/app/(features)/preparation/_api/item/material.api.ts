import { DayWork } from '@/models/tender/lot/item/day-work';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base material api
const materialApi = entityApi.entitySliceApi['sor-materials'];

export const materialSliceApi: typeof EntitySliceApi =
  createEntitySlice<DayWork>(materialApi, 'sor-materials');

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = materialSliceApi;
