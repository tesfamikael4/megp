import { BillOfMaterial } from '@/models/tender/lot/item/bill-of-material.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base billOfMaterial api
const billOfMaterialApi = entityApi.entitySliceApi['sor-bill-of-materials'];

export const billOfMaterialSliceApi: typeof EntitySliceApi =
  createEntitySlice<BillOfMaterial>(billOfMaterialApi, 'sor-bill-of-materials');

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = billOfMaterialSliceApi;
