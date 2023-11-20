import { Organization } from '@/models/organization';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization api
const organizationApi = entityApi.entitySliceApi['organizations'];

export const organizationSliceApi: typeof EntitySliceApi =
  createEntitySlice<Organization>(organizationApi as any, 'Organizations');

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = organizationSliceApi;
