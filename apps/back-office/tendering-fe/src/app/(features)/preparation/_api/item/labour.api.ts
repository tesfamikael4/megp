import { DayWork } from '@/models/tender/lot/item/day-work';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base labour api
const labourApi = entityApi.entitySliceApi['sor-labors'];

export const labourSliceApi: typeof EntitySliceApi = createEntitySlice<DayWork>(
  labourApi,
  'sor-labors',
);

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = labourSliceApi;
