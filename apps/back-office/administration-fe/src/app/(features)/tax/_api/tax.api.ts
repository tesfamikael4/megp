import { Tax } from '@/models/tax';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const taxApi = entityApi.entitySliceApi['taxs'];

export const taxSliceApi: typeof EntitySliceApi = createEntitySlice<Tax>(
  taxApi as any,
  'taxs',
);

export const {
  useListQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useListByIdQuery,
  useLazyListQuery,
} = taxSliceApi;
