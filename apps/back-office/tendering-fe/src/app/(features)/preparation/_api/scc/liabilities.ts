import { liabililitesForm } from '@/models/contract-condition/liability-forms.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base liabilities api
const liabilitiesApi = entityApi.entitySliceApi['scc-liabilities'];

export const liabilitiesSliceApi: typeof EntitySliceApi =
  createEntitySlice<liabililitesForm>(liabilitiesApi, 'scc-liabilities');

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = liabilitiesSliceApi;
