import { ITenderEvaluation } from '@/models/tender/bid-procedures/evaluation.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const bidEvaluationsApi = entityApi.entitySliceApi['bds-evaluations'];

export const bidEvaluationsSliceApi: typeof EntitySliceApi =
  createEntitySlice<ITenderEvaluation>(bidEvaluationsApi, 'bds-evaluations');

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useListByIdQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = bidEvaluationsSliceApi;
