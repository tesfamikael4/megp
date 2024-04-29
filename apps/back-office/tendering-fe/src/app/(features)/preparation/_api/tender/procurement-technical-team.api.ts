import { ProcurementTechnicalTeam } from '@/models/tender/procurement-technical-team.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const procurementTechnicalTeamApi =
  entityApi.entitySliceApi['procurement-technical-teams'];

export const procurementTechnicalTeamSliceApi: typeof EntitySliceApi =
  createEntitySlice<ProcurementTechnicalTeam>(
    procurementTechnicalTeamApi,
    'team-members',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = procurementTechnicalTeamSliceApi;
