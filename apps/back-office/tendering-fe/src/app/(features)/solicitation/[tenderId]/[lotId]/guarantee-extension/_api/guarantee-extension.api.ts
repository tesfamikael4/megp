import { GuaranteeForfeit } from '@/models/guarantee-forfiet/guarantee-forfiet';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const guaranteeExtensionApi =
  entityApi.entitySliceApi['bid-guarantee-extensions'];

export const guaranteeExtensionSliceApi: typeof EntitySliceApi =
  createEntitySlice<GuaranteeForfeit>(
    guaranteeExtensionApi as any,
    'bid-guarantee-extensions',
  );

export const {
  useListQuery,
  useReadQuery,
  useLazyReadQuery,
  useLazyListQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = guaranteeExtensionSliceApi;
