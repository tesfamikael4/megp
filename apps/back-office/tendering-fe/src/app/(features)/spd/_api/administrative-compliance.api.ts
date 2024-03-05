import { SpdPreliminaryExamination } from '@/models/spd/preliminary-examination.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base administrativeCompliance api
const administrativeComplianceApi =
  entityApi.entitySliceApi['administrative-compliance'];

export const administrativeComplianceSliceApi: typeof EntitySliceApi =
  createEntitySlice<SpdPreliminaryExamination>(
    administrativeComplianceApi,
    'spd-preliminary-evaluations',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = administrativeComplianceSliceApi;
