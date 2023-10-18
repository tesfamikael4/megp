import { Initiation } from '@/models/initiation';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const initiationApi = entityApi.entitySliceApi['plan-initiations'];

export const initiationSliceApi: typeof EntitySliceApi =
  createEntitySlice<Initiation>(initiationApi as any, 'plan-initiations');

export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = initiationSliceApi;
