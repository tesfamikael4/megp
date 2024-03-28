import { ITenderSubmission } from '@/models/tender/bid-procedures/submission.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const participationFeeApi =
  entityApi.entitySliceApi['tender-participation-fees'];

export const participationFeeSliceApi: typeof EntitySliceApi =
  createEntitySlice<ITenderSubmission>(
    participationFeeApi,
    'tender-participation-fees',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useLazyReadQuery,
  useListByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = participationFeeSliceApi;
