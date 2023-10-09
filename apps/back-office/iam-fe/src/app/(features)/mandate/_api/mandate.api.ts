import { OrganizationSector } from '@/models/organization-sector';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization sector api
const mandateApi = entityApi.entitySliceApi['mandates'];

export const myMandateSliceApi: typeof EntitySliceApi =
  createEntitySlice<OrganizationSector>(mandateApi as any, 'mandates');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = myMandateSliceApi;
