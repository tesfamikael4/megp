import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const biddingInvitationApi =
  entityApi.entitySliceApi['rfx-product-invitations'];

export const biddingInvitationsliceApi: typeof EntitySliceApi =
  createEntitySlice<any>(biddingInvitationApi, 'rfx-product-invitations');

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
