import { Taxonomy } from '@/models/taxonomy';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const taxonomyApi = entityApi.entitySliceApi['taxonomy'];

export const taxonomySliceApi: typeof EntitySliceApi =
  createEntitySlice<Taxonomy>(taxonomyApi as any, 'taxonomy');

export const {
  useListQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = taxonomySliceApi;
