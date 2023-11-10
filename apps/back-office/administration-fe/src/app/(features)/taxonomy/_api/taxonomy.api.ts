import { Taxonomy } from '@/models/taxonomy';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const taxonomyApi = entityApi.entitySliceApi['classifications'];

export const taxonomySliceApi: typeof EntitySliceApi =
  createEntitySlice<Taxonomy>(taxonomyApi as any, 'classifications');

export const {
  useListQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = taxonomySliceApi;
