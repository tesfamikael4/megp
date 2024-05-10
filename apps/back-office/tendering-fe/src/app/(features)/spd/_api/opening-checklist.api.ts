import { OpeningChecklist } from '@/models/spd/opening-checklist.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base openingChecklist api
const openingChecklistApi = entityApi.entitySliceApi['spd-opening-checklists'];

export const openingChecklistSliceApi: typeof EntitySliceApi =
  createEntitySlice<OpeningChecklist>(
    openingChecklistApi,
    'spd-opening-checklists',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = openingChecklistSliceApi;
