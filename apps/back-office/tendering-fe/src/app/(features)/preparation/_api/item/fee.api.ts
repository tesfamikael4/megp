import { Fee } from '@/models/tender/lot/item/fee.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base fee api
const feeApi = entityApi.entitySliceApi['sor-fees'];

export const feeSliceApi: typeof EntitySliceApi = createEntitySlice<Fee>(
  feeApi,
  'sor-fees',
);

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = feeSliceApi;
