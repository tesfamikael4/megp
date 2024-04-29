import { GuaranteeForfeit } from '@/models/guarantee-forfiet/guarantee-forfiet';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const guaranteeForfeitApi = entityApi.entitySliceApi['guarantees'];

export const guaranteeForfeitSliceApi: typeof EntitySliceApi =
  createEntitySlice<GuaranteeForfeit>(guaranteeForfeitApi as any, 'guarantees');

export const {
  useListQuery,
  useReadQuery,
  useLazyReadQuery,
  useLazyListQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = guaranteeForfeitSliceApi;
