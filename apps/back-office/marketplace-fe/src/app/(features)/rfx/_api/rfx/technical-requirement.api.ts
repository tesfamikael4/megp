import { TechnicalRequirement } from '@/models/tender/technical-requirement.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base technicalRequirement api
const technicalRequirementApi =
  entityApi.entitySliceApi['rfx-technical-requirements'];

export const technicalRequirementSliceApi: typeof EntitySliceApi =
  createEntitySlice<TechnicalRequirement>(
    technicalRequirementApi,
    'rfx-technical-requirements',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useListByIdQuery,
  useLazyListByIdQuery,
  useReadQuery,

  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = technicalRequirementSliceApi;
