import { Activities } from '@/models/activities';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const activitiesApi = entityApi.entitySliceApi['activities'];

export const activitiesSliceApi: typeof EntitySliceApi =
  createEntitySlice<Activities>(activitiesApi as any, 'Activities');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
  useLazyListByIdQuery,
  useListByIdQuery,
  useLazyListArchivedByIdQuery,
  useRestoreMutation,
} = activitiesSliceApi;
