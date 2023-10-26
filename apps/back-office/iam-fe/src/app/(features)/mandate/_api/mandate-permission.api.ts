import { OrganizationSector } from '@/models/organization-sector';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization sector api
const mandateApi = entityApi.entitySliceApi['mandate-permissions'];

export const myMandateSliceApi: typeof EntitySliceApi =
  createEntitySlice<OrganizationSector>(
    mandateApi as any,
    'mandate-permissions',
  );

export const {
  useFirstRelationQuery,
  useRelationMutation,
  useLazySecondRelationQuery,
  useLazyFirstRelationQuery,
  useSecondRelationQuery,
} = myMandateSliceApi;
