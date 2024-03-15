import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization api
const IPDCApi = entityApi.entitySliceApi['iPDC'];

export const IPDCSlice: typeof EntitySliceApi = createEntitySlice<any>(
  IPDCApi as any,
  'iPDC',
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
} = IPDCSlice;
