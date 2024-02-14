import { AdministrativeCompliance } from '@/models/tender/lot/administrative-compliance.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base administrativeCompliance api
const administrativeComplianceApi =
  entityApi.entitySliceApi['administrative-compliance'];

export const administrativeComplianceSliceApi: typeof EntitySliceApi =
  createEntitySlice<AdministrativeCompliance>(
    administrativeComplianceApi,
    'spd-administrative-compliances',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = administrativeComplianceSliceApi;
