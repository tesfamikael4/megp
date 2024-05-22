import { ProcurementTechnicalTeam } from '@/models/tender/procurement-technical-team.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const procurementTechnicalTeamApi =
  entityApi.entitySliceApi['rfx-procurement-technical-teams'];

export const procurementTechnicalTeamSliceApi: typeof EntitySliceApi =
  createEntitySlice<ProcurementTechnicalTeam>(
    procurementTechnicalTeamApi,
    'rfx-procurement-technical-teams',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = procurementTechnicalTeamSliceApi;
