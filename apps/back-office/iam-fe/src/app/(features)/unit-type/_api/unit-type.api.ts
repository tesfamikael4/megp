import { UnitType } from '@/models/unit-type';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization type api
const unitTypeApi = entityApi.entitySliceApi['unit-type'];

export const unitSliceApi: typeof EntitySliceApi = createEntitySlice<UnitType>(
  unitTypeApi as any,
  'unit-type',
);

export const {
  useLazyListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useListByIdQuery,
} = unitSliceApi;
