import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const evalResponseApi = entityApi.entitySliceApi['eval-responses'];

export const evalResponseSliceApi: typeof EntitySliceApi =
  createEntitySlice<any>(evalResponseApi, 'eval-responses');

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = evalResponseSliceApi;
