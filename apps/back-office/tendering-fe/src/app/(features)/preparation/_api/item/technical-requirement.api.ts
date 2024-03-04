import { TechnicalRequirement } from '@/models/tender/lot/item/technical-requirement.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base technicalRequirement api
const technicalRequirementApi =
  entityApi.entitySliceApi['sor-technical-requirements'];

export const technicalRequirementSliceApi: typeof EntitySliceApi =
  createEntitySlice<TechnicalRequirement>(
    technicalRequirementApi,
    'sor-technical-requirements',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = technicalRequirementSliceApi;
