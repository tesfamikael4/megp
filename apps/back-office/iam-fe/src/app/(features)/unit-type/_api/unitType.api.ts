import { UnitType } from '@/models/unit-type';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization type api
const unitTypeApi = entityApi.entitySliceApi['unitTypes'];

export const unitSliceApi: typeof EntitySliceApi = createEntitySlice<UnitType>(
  unitTypeApi as any,
  'unitTypes',
);

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = unitSliceApi;
