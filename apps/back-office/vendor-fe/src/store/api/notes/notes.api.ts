import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const noteApi = entityApi.entitySliceApi['notes'];

export const noteSliceApi: typeof EntitySliceApi = createEntitySlice<any>(
  noteApi as any,
  'notes',
);

export const {
  useListQuery,
  useListByAppIdQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useLazyReadQuery,
  useLazyListQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = noteSliceApi;
