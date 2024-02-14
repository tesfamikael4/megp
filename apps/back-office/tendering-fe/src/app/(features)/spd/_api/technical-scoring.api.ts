import { SpdTechnicalScoring } from '@/models/spd/technical-scoring';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base technicalScoring api
const technicalScoringApi = entityApi.entitySliceApi['technical-scoring'];

export const technicalScoringSliceApi: typeof EntitySliceApi =
  createEntitySlice<SpdTechnicalScoring>(
    technicalScoringApi,
    'spd-technical-scoring',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = technicalScoringSliceApi;
