import { Organization } from '@/models/organization';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const organizationsApi = entityApi.entitySliceApi['organizations'];

export const organizationsSliceApi: typeof EntitySliceApi =
  createEntitySlice<Organization>(organizationsApi as any, 'organizations');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListQuery,
} = organizationsSliceApi;
