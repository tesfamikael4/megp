import { SpdTechnicalScoring } from '@/models/spd/technical-scoring';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base contractFormForm api
const contractFormFormApi = entityApi.entitySliceApi['spd-contract-forms'];

export const contractFormFormSliceApi: typeof EntitySliceApi =
  createEntitySlice<SpdTechnicalScoring>(
    contractFormFormApi,
    'spd-contract-forms',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = contractFormFormSliceApi;
