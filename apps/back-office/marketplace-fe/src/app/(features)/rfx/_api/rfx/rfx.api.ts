import { Tender } from '@/models/tender/tender.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base tender api
const tenderApi = entityApi.entitySliceApi['rfxs'];

export const tenderSliceApi: typeof EntitySliceApi = createEntitySlice<Tender>(
  tenderApi,
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
} = tenderSliceApi;
