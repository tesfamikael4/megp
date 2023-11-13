import { Measurement } from '@/models/measurement';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const measurementApi = entityApi.entitySliceApi['measurements'];

export const measurementSliceApi: typeof EntitySliceApi =
  createEntitySlice<Measurement>(measurementApi as any, 'measurements');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
} = measurementSliceApi;
