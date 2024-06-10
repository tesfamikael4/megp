import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const teamMembersApi = entityApi.entitySliceApi['team-members'];

export const teamMemberssliceApi: typeof EntitySliceApi =
  createEntitySlice<any>(teamMembersApi, 'team-members');

export const {
  useListQuery,
  useListByIdQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = teamMemberssliceApi;
