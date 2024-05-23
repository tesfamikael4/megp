import { Tender } from '@/models/tender/tender.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base tender api
const rfxApi = entityApi.entitySliceApi['rfxs'];

export const rfxSliceApi: typeof EntitySliceApi = createEntitySlice<Tender>(
  rfxApi,
  'rfxs',
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
} = rfxSliceApi;
