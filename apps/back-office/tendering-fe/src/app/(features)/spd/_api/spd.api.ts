import { Spd } from '@/models/spd/spd.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base spd api
const spdApi = entityApi.entitySliceApi['spd'];

export const spdSliceApi: typeof EntitySliceApi = createEntitySlice<Spd>(
  spdApi,
  'Spd',
);

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = spdSliceApi;
