import { ITenderSubmission } from '@/models/tender/bid-procedures/submission.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const bidSubmissionsApi = entityApi.entitySliceApi['bds-submissions'];

export const bidSubmissionsSliceApi: typeof EntitySliceApi =
  createEntitySlice<ITenderSubmission>(bidSubmissionsApi, 'bds-submissions');

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useLazyReadQuery,
  useListByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = bidSubmissionsSliceApi;
