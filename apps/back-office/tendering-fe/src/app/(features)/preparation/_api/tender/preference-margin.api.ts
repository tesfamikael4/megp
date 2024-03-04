import { MarginOfPreference } from '@/models/tender/lot/preference-marign.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base marginOfPreference api
const marginOfPreferenceApi =
  entityApi.entitySliceApi['eqc-preference-margins'];

export const marginOfPreferenceSliceApi: typeof EntitySliceApi =
  createEntitySlice<MarginOfPreference>(
    marginOfPreferenceApi,
    'eqc-preference-margins',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = marginOfPreferenceSliceApi;
