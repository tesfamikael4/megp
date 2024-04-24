import { Donor } from '@/models/donor';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const donorApi = entityApi.entitySliceApi['donors'];

export const donorSliceApi: typeof EntitySliceApi = createEntitySlice<Donor>(
  donorApi as any,
  'donors',
);

export const {
  useListQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useListByIdQuery,
  useLazyListQuery,
} = donorSliceApi;
