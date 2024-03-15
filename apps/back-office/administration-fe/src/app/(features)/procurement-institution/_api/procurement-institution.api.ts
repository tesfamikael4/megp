import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization api
const procurementInstitutionsApi =
  entityApi.entitySliceApi['procurement-institution'];

export const procurementInstitutionsSlice: typeof EntitySliceApi =
  createEntitySlice<any>(
    procurementInstitutionsApi as any,
    'procurement-institution',
  );

export const {
  useListQuery,
  useRelationMutation,
  useLazySecondRelationQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useListByIdQuery,
  useLazyListByIdQuery,
  useLazyListArchivedByIdQuery,
  useRestoreMutation,
} = procurementInstitutionsSlice;
