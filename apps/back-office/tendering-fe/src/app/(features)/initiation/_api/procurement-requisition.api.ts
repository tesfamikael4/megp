import { ProcurementRequisition } from '@/models/procurement-requsition';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const ProcurementApi = entityApi.entitySliceApi['procurement-requisitions'];

export const procurementSliceApi: typeof EntitySliceApi =
  createEntitySlice<ProcurementRequisition>(
    ProcurementApi as any,
    'procurement-requisitions',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useLazyReadQuery,
} = procurementSliceApi;
