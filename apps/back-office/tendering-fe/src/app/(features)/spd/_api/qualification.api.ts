import { Qualification } from '@/models/tender/lot/qualification';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base qualification api
const qualificationApi = entityApi.entitySliceApi['qualification'];

export const qualificationSliceApi: typeof EntitySliceApi =
  createEntitySlice<Qualification>(qualificationApi, 'spd-qualifications');

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = qualificationSliceApi;
