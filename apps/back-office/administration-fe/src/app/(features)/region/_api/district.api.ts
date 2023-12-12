import { District } from '@/models/district';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const districtApi = entityApi.entitySliceApi['district'];

export const districtSliceApi: typeof EntitySliceApi =
  createEntitySlice<District>(districtApi as any, 'district');

export const {
  useListQuery,
  useListByAppIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
} = districtSliceApi;
