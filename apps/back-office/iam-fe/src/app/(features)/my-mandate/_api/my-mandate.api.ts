import { OrganizationSector } from '@/models/organization-sector';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization sector api
const omyMandateApi = entityApi.entitySliceApi['my-mandate'];

export const myMandateSliceApi: typeof EntitySliceApi =
  createEntitySlice<OrganizationSector>(omyMandateApi as any, 'my-mandate');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = myMandateSliceApi;
