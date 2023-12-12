import { Region } from '@/models/region';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const regionApi = entityApi.entitySliceApi['region'];

export const regionSliceApi: typeof EntitySliceApi = createEntitySlice<Region>(
  regionApi as any,
  'region',
);

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
} = regionSliceApi;
