import { GeneralProvisionForm } from '@/models/contract-condition/contract-forms.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base contract-delivarable api
const GeneralProvisionApi = entityApi.entitySliceApi['scc-general-provisions'];

export const GeneralProvisionSliceApi: typeof EntitySliceApi =
  createEntitySlice<GeneralProvisionForm>(
    GeneralProvisionApi,
    'scc-general-provisions',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = GeneralProvisionSliceApi;
