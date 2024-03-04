import { ITenderPreparation } from '@/models/tender/bid-procedures/preparation.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const bidPreparationsApi = entityApi.entitySliceApi['bds-preparations'];
export const bidPreparationsSliceApi: typeof EntitySliceApi =
  createEntitySlice<ITenderPreparation>(bidPreparationsApi, 'bds-preparations');

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useLazyReadQuery,
  useListByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = bidPreparationsSliceApi;
