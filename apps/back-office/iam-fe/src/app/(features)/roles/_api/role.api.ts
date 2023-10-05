import { OrganizationSector } from '@/models/organization-sector';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization sector api
const roleApi = entityApi.entitySliceApi['role'];

export const roleSliceApi: typeof EntitySliceApi =
  createEntitySlice<OrganizationSector>(roleApi as any, 'role');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = roleSliceApi;
