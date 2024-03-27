import { GuaranteeRequest } from '@/models/guarantee-request/guarantee-request';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const guaranteeRequestApi = entityApi.entitySliceApi['guarantees'];

export const guaranteeRequestSliceApi: typeof EntitySliceApi =
  createEntitySlice<GuaranteeRequest>(guaranteeRequestApi as any, 'guarantees');

export const {
  useListQuery,
  useReadQuery,
  useLazyReadQuery,
  useLazyListQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = guaranteeRequestSliceApi;
