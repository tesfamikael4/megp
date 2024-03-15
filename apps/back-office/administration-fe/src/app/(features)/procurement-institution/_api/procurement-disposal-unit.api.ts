import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization api
const procurementDisposalUnitsApi =
  entityApi.entitySliceApi['procurement-disposal-unit'];

export const procurementDisposalUnitsSlice: typeof EntitySliceApi =
  createEntitySlice<any>(
    procurementDisposalUnitsApi as any,
    'procurement-disposal-unit',
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
} = procurementDisposalUnitsSlice;
