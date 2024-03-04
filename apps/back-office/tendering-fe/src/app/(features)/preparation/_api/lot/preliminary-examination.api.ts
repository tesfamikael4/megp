import { SpdPreliminaryExamination } from '@/models/spd/preliminary-examination.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base preliminaryEvaluation api
const preliminaryEvaluationApi =
  entityApi.entitySliceApi['eqc-preliminary-examinations'];

export const preliminaryEvaluationSliceApi: typeof EntitySliceApi =
  createEntitySlice<SpdPreliminaryExamination>(
    preliminaryEvaluationApi,
    'eqc-preliminary-examinations',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = preliminaryEvaluationSliceApi;
