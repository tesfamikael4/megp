import { Unit } from '@/models/unit';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization api
const unitApi = entityApi.entitySliceApi['unit'];

export const unitSliceApi: typeof EntitySliceApi = createEntitySlice<Unit>(
  unitApi as any,
  'unit',
);

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = unitSliceApi;
