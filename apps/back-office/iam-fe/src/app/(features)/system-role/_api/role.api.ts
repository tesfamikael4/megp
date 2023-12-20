import { Organization } from '@/models/organization';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const organizationApi = entityApi.entitySliceApi['role-systems'];

export const organizationSliceApi: typeof EntitySliceApi =
  createEntitySlice<Organization>(organizationApi as any, 'role-systems');

export const {
  useListQuery,
  useLazyListByIdQuery,
  useLazyListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListArchivedQuery,
  useRestoreMutation,
} = organizationSliceApi;
