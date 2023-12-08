import { ProcurementThreshold } from '@/models/procurement-threshold';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const procurementThresholdApi =
  entityApi.entitySliceApi[' procurement-thresholds'];

export const procurementThersholdSliceApi: typeof EntitySliceApi =
  createEntitySlice<ProcurementThreshold>(
    procurementThresholdApi as any,
    'procurement-thresholds',
  );

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
} = procurementThersholdSliceApi;
