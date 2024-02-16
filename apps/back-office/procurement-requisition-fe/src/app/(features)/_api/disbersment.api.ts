import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const dispersmentApi =
  entityApi.entitySliceApi['procurement-requisition-disbursements'];

export const dispersmentSliceApi: typeof EntitySliceApi =
  createEntitySlice<any>(
    dispersmentApi as any,
    'procurement-requisition-disbursements',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useLazyListByAppIdQuery,
  useReadQuery,
} = dispersmentSliceApi;
