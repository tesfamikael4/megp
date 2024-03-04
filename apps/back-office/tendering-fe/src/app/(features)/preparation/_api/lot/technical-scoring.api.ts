import { TechnicalScoring } from '@/models/tender/lot/technical-scoring.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base eqcTechnicalScoring api
const eqcTechnicalScoringApi =
  entityApi.entitySliceApi['eqc-technical-scorings'];

export const eqcTechnicalScoringSliceApi: typeof EntitySliceApi =
  createEntitySlice<TechnicalScoring>(
    eqcTechnicalScoringApi,
    'eqc-technical-scorings',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = eqcTechnicalScoringSliceApi;
