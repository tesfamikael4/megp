import { GuaranteeExtension } from '@/models/guarantee-extension/guarantee-extension';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const guaranteeExtensionApi =
  entityApi.entitySliceApi['bid-guarantee-extensions'];

export const guaranteeExtensionSliceApi: typeof EntitySliceApi =
  createEntitySlice<GuaranteeExtension>(
    guaranteeExtensionApi as any,
    'bid-guarantee-extensions',
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
} = guaranteeExtensionSliceApi;
