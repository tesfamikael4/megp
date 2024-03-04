import { BidSecurity } from '@/models/tender/lot/bid-security.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base bidSecurity api
const bidSecurityApi = entityApi.entitySliceApi['bid-securities'];

export const bidSecuritySliceApi: typeof EntitySliceApi =
  createEntitySlice<BidSecurity>(bidSecurityApi, 'bid-securities');

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = bidSecuritySliceApi;
