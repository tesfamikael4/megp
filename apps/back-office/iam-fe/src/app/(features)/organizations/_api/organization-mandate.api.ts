import { Organization } from '@/models/organization';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization api
const organizationApi = entityApi.entitySliceApi['organization-mandates'];

export const organizationSliceApi: typeof EntitySliceApi =
  createEntitySlice<Organization>(
    organizationApi as any,
    'organization-mandates',
    'organization',
    'mandate',
  );

export const {
  useRelationMutation,
  useLazySecondRelationQuery,
  useLazyFirstRelationQuery,
} = organizationSliceApi;
('');
