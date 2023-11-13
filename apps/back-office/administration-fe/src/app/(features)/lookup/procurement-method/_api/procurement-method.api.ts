import { ProcurementMethod } from '@/models/procurement-method';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const procurementMethodApi = entityApi.entitySliceApi['procurement-method'];

export const procurementMethodSliceApi: typeof EntitySliceApi =
  createEntitySlice<ProcurementMethod>(
    procurementMethodApi as any,
    'procurement-method',
  );

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useListByIdQuery,
} = procurementMethodSliceApi;
