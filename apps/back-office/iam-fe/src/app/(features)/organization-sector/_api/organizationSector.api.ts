import { OrganizationSector } from '@/models/organization-sector';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization sector api
const organizationSectorApi = entityApi.entitySliceApi['organization-sector'];

export const organizationSectorSliceApi: typeof EntitySliceApi =
  createEntitySlice<OrganizationSector>(
    organizationSectorApi as any,
    'organization-sector',
  );

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = organizationSectorSliceApi;
