import { ITenderGeneral } from '@/models/tender/bid-procedures/general.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base tender api
const bidGeneralApi = entityApi.entitySliceApi['bds-generals'];

export const bidGeneralSliceApi: typeof EntitySliceApi =
  createEntitySlice<ITenderGeneral>(bidGeneralApi, 'bds-generals');

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useListByIdQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = bidGeneralSliceApi;
