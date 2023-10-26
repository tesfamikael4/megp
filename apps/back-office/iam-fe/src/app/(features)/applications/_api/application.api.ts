import { Application } from '@/models/application';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const applicationApi = entityApi.entitySliceApi['applications'];

export const groupSliceApi: typeof EntitySliceApi =
  createEntitySlice<Application>(applicationApi as any, 'Applications');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
} = groupSliceApi;
