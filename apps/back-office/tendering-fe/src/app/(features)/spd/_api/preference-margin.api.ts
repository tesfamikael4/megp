import { SpdPreferenceMargin } from '@/models/spd/preference-margin.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base preferenceMargin api
const preferenceMarginApi = entityApi.entitySliceApi['preference-margins'];

export const preferenceMarginSliceApi: typeof EntitySliceApi =
  createEntitySlice<SpdPreferenceMargin>(
    preferenceMarginApi,
    'spd-preference-margins',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = preferenceMarginSliceApi;
