import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const potermsApi = entityApi.entitySliceApi['po-terms'];

export const poTermsSliceApi: typeof EntitySliceApi = createEntitySlice<any>(
  potermsApi,
  'po-terms',
);

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = poTermsSliceApi;
