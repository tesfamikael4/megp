import { GuaranteeForfeit } from '@/models/guarantee-forfeit';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const guaranteeForfeitApi = entityApi.entitySliceApi['guarantee-forfeits'];

export const guaranteeForfeitSliceApi: typeof EntitySliceApi =
  createEntitySlice<GuaranteeForfeit>(
    guaranteeForfeitApi as any,
    'guarantee-forfeits',
  );

export const {
  useListQuery,
  useReadQuery,
  useLazyReadQuery,
  useLazyListQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = guaranteeForfeitSliceApi;
