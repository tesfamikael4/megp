import { GuaranteesForm } from '@/models/contract-condition/guararentee-form.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base guarantees api
const guaranteesApi = entityApi.entitySliceApi['scc-guarantees'];

export const guaranteesSliceApi: typeof EntitySliceApi =
  createEntitySlice<GuaranteesForm>(guaranteesApi, 'scc-guarantees');

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = guaranteesSliceApi;
