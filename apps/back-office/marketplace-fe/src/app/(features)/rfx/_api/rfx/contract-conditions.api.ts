import { ContractConditions } from '@/models/tender/contract-conditions.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base item api
const contractConditionsApi =
  entityApi.entitySliceApi['rfx-bid-contract-conditions'];

export const contractConditionsSliceApi: typeof EntitySliceApi =
  createEntitySlice<ContractConditions>(
    contractConditionsApi,
    'rfx-bid-contract-conditions',
  );

export const {
  useListQuery,
  useListByIdQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = contractConditionsSliceApi;
