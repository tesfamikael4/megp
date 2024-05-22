import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const biddingInvitationApi = entityApi.entitySliceApi['rfx-bid-invitations'];

export const biddingInvitationsliceApi: typeof EntitySliceApi =
  createEntitySlice<any>(biddingInvitationApi, 'rfx-bid-invitations');

export const {
  useListQuery,
  useListByIdQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = biddingInvitationsliceApi;
