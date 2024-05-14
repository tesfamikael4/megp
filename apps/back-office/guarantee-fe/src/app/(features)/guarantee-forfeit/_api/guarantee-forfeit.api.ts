import { GuaranteeForfeit } from '@/models/guarantee-forfeit/guarantee-forfeit';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const guaranteeForfeitApi = entityApi.entitySliceApi['bid-guarantee-forfeits'];

export const guaranteeForfeitSliceApi: typeof EntitySliceApi =
  createEntitySlice<GuaranteeForfeit>(
    guaranteeForfeitApi as any,
    'bid-guarantee-forfeits',
  );

export const {
  useListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useLazyReadQuery,
  useLazyListQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = guaranteeForfeitSliceApi;
