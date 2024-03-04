import { ITenderAward } from '@/models/tender/bid-procedures/award.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const bidAwardsApi = entityApi.entitySliceApi['bds-awards'];

export const bidAwardsSliceApi: typeof EntitySliceApi =
  createEntitySlice<ITenderAward>(bidAwardsApi, 'bds-awards');

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useLazyReadQuery,
  useListByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = bidAwardsSliceApi;
