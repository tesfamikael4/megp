import { Contract } from '@/models/contract';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const contractApi = entityApi.entitySliceApi['contract-allocated-items'];

export const contractSliceApi: typeof EntitySliceApi =
  createEntitySlice<Contract>(contractApi as any, 'contract-allocated-items');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
} = contractSliceApi;
