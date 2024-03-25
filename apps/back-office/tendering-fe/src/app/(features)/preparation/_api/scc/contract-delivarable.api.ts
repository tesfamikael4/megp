import { ContactDeliverablesForm } from '@/models/contract-condition/contract-delivalables';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base contract-delivarable api
const contractDelivarablesApi =
  entityApi.entitySliceApi['scc-contract-deliverables'];

export const contractDelivarablesSliceApi: typeof EntitySliceApi =
  createEntitySlice<ContactDeliverablesForm>(
    contractDelivarablesApi,
    'scc-contract-deliverables',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = contractDelivarablesSliceApi;
