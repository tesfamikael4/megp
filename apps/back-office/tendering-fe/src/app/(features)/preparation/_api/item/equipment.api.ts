import { DayWork } from '@/models/tender/lot/item/day-work';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base equipments api
const equipmentsApi = entityApi.entitySliceApi['sor-equipments'];

export const equipmentsSliceApi: typeof EntitySliceApi =
  createEntitySlice<DayWork>(equipmentsApi, 'sor-equipments');

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = equipmentsSliceApi;
