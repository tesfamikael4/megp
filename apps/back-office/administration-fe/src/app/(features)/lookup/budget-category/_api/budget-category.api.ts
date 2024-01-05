import { ProcurementMethod } from '@/models/procurement-method';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const procurementMethodApi = entityApi.entitySliceApi['budget-categories'];

export const procurementMethodSliceApi: typeof EntitySliceApi =
  createEntitySlice<ProcurementMethod>(
    procurementMethodApi as any,
    'budget-categories',
  );

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useListByIdQuery,
  useLazyListQuery,
} = procurementMethodSliceApi;
