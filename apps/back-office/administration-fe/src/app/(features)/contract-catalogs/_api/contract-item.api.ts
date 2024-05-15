import { Contract } from '@/models/contract';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const contractItemApi = entityApi.entitySliceApi['contract-items'];

export const contractItemSliceApi: typeof EntitySliceApi =
  createEntitySlice<Contract>(contractItemApi as any, 'contract-items');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
  useLazyListByIdQuery,
} = contractItemSliceApi;
