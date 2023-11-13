// import { Measurement } from '@/models/measurement';
// import entityApi from '@/store/entity/api';
// import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// // get base group api
// const measurementApi = entityApi.entitySliceApi['unit-of-measurements'];

// export const measurementSliceApi: typeof EntitySliceApi =
//   createEntitySlice<Measurement>(measurementApi as any, 'unit-of-measurements');

// export const {
//   useListQuery,
//   useReadQuery,
//   useCreateMutation,
//   useUpdateMutation,
//   useDeleteMutation,
//   useLazyListQuery,
// } = measurementSliceApi;
import { Measurement } from '@/models/measurement';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const measurementApi = entityApi.entitySliceApi['extra-unit-of-measurements'];

export const measurementSliceApi: typeof EntitySliceApi =
  createEntitySlice<Measurement>(
    measurementApi as any,
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
} = measurementSliceApi;
