import { Spd } from '@/models/spd/spd.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base spd api
const configSpdApi = entityApi.entitySliceApi['spd'];

export const configSpdSliceApi: typeof EntitySliceApi = createEntitySlice<Spd>(
  configSpdApi,
  'spd',
);

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = configSpdSliceApi;
