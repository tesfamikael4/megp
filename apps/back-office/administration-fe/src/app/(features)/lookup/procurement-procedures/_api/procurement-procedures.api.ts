import { ProcurementMethod } from '@/models/procurement-method';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const procurementProceduresApi =
  entityApi.entitySliceApi['procurement-procedures'];

export const procurementProceduresSliceApi: typeof EntitySliceApi =
  createEntitySlice<ProcurementMethod>(
    procurementProceduresApi as any,
    'procurement-procedures',
  );

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useListByIdQuery,
} = procurementProceduresSliceApi;
