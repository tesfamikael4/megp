import { Contract } from '@/models/contract';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const contractApi = entityApi.entitySliceApi['contract-catalogs'];

export const contractSliceApi: typeof EntitySliceApi =
  createEntitySlice<Contract>(contractApi as any, 'contract-catalogs');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
} = contractSliceApi;
