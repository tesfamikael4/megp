import { MeasurementUnit } from '@/models/measurement-unit';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const mUnitApi = entityApi.entitySliceApi['extra-unit-of-measurements'];

export const mUnitSliceApi: typeof EntitySliceApi =
  createEntitySlice<MeasurementUnit>(
    mUnitApi as any,
    'extra-unit-of-measurements',
  );

export const {
  useListQuery,
  useListByAppIdQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
} = mUnitSliceApi;
