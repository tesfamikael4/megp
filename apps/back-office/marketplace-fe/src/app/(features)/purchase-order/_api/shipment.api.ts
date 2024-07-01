import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const poShipmentApi = entityApi.entitySliceApi['po-shipments'];

export const poShipmentSliceApi: typeof EntitySliceApi = createEntitySlice<any>(
  poShipmentApi,
  'po-shipments',
);

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = poShipmentSliceApi;
