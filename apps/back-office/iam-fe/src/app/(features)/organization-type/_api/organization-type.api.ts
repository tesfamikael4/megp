import { OrganizationType } from '@/models/organization-type';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization type api
const organizationTypeApi = entityApi.entitySliceApi['organization-type'];

export const organizationSliceApi: typeof EntitySliceApi =
  createEntitySlice<OrganizationType>(
    organizationTypeApi as any,
    'organization-type',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = organizationSliceApi;
