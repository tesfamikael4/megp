import { Price } from '@/models/price';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const priceApi = entityApi.entitySliceApi['price'];

export const priceSliceApi: typeof EntitySliceApi = createEntitySlice<Price>(
  priceApi as any,
  'Service-pricing',
);

export const {
  useListQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = priceSliceApi;
