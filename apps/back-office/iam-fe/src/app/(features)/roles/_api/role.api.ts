import { OrganizationSector } from '@/models/organization-sector';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization sector api
const roleApi = entityApi.entitySliceApi['roles'];

export const roleSliceApi: typeof EntitySliceApi =
  createEntitySlice<OrganizationSector>(roleApi as any, 'roles');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = roleSliceApi;
