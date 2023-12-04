import { Currency } from '@/models/currency';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const currencyApi = entityApi.entitySliceApi['currencies'];

export const currencySliceApi: typeof EntitySliceApi =
  createEntitySlice<Currency>(currencyApi as any, 'currencies');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
} = currencySliceApi;
