import { GuaranteeRelsease } from '@/models/guarantee-release/guarantee-release';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const guaranteeReleaseApi = entityApi.entitySliceApi['bid-guarantee-releases'];

export const guaranteeReleaseSliceApi: typeof EntitySliceApi =
  createEntitySlice<GuaranteeRelsease>(
    guaranteeReleaseApi as any,
    'bid-guarantee-releases',
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
} = guaranteeReleaseSliceApi;
