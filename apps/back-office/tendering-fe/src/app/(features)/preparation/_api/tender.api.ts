import { Tender } from '@/models/tender/tender.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base tender api
const tenderApi = entityApi.entitySliceApi['tender'];

export const tenderSliceApi: typeof EntitySliceApi = createEntitySlice<Tender>(
  tenderApi,
  'tender',
);

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = tenderSliceApi;
