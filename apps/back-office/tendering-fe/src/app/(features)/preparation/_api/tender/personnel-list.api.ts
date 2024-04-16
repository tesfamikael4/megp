import { ProfessionalList } from '@/models/tender/lot/personnel';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const participationFeeApi = entityApi.entitySliceApi['tender-personals'];

export const personnelListSliceApi: typeof EntitySliceApi =
  createEntitySlice<ProfessionalList>(participationFeeApi, 'tender-personals');

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useLazyReadQuery,
  useListByIdQuery,
  useLazyListByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = personnelListSliceApi;
