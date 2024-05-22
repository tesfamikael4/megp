import { BiddingProcedure } from '@/models/tender/bidding-procedure';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base item api
const biddingProcedureApi = entityApi.entitySliceApi['rfx-bid-procedures'];

export const biddingProcedureSliceApi: typeof EntitySliceApi =
  createEntitySlice<BiddingProcedure>(
    biddingProcedureApi,
    'rfx-bid-procedures',
  );

export const {
  useListQuery,
  useListByIdQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = biddingProcedureSliceApi;
