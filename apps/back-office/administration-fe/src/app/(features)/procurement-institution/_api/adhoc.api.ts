import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization api
const AdhocApi = entityApi.entitySliceApi['adhoc-team'];

export const AdhocSlice: typeof EntitySliceApi = createEntitySlice<any>(
  AdhocApi as any,
  'adhoc-team',
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
} = AdhocSlice;
