import { CurrencyForm } from '@/models/contract-condition/currencies.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base currencies api
const CurrencyApi = entityApi.entitySliceApi['currencies'];

export const CurrencySliceApi: typeof EntitySliceApi =
  createEntitySlice<CurrencyForm>(CurrencyApi, 'currencies');

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = CurrencySliceApi;
