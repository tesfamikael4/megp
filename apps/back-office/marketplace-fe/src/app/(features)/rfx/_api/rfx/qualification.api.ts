import { Qualification } from '@/models/tender/qualification.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base rfxQualification api
const rfxQualificationApi = entityApi.entitySliceApi['rfx-bid-qualifications'];

export const rfxQualificationSliceApi: typeof EntitySliceApi =
  createEntitySlice<Qualification>(
    rfxQualificationApi,
    'rfx-bid-qualifications',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = rfxQualificationSliceApi;
