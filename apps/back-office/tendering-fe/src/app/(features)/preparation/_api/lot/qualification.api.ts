import { Qualification } from '@/models/tender/lot/qualification.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base eqcQualification api
const eqcQualificationApi = entityApi.entitySliceApi['eqc-qualifications'];

export const eqcQualificationSliceApi: typeof EntitySliceApi =
  createEntitySlice<Qualification>(eqcQualificationApi, 'eqc-qualifications');

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = eqcQualificationSliceApi;
