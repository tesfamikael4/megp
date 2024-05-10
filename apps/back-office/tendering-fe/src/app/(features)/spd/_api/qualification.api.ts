import { SpdQualification } from '@/models/spd/qualification.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base qualification api
const qualificationApi = entityApi.entitySliceApi['qualification'];

export const qualificationSliceApi: typeof EntitySliceApi =
  createEntitySlice<SpdQualification>(qualificationApi, 'spd-qualifications');

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = qualificationSliceApi;
