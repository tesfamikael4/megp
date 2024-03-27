import { GuaranteeRelease } from '@/models/guarantee-release/guarantee-release';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const guaranteeReleaseApi = entityApi.entitySliceApi['guarantees'];

export const guaranteeReleaseSliceApi: typeof EntitySliceApi =
  createEntitySlice<GuaranteeRelease>(
    guaranteeReleaseApi as any,
    'guaranteeguarantee',
  );

export const {
  useListQuery,
  useReadQuery,
  useLazyReadQuery,
  useLazyListQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = guaranteeReleaseSliceApi;
