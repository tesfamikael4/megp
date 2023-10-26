import { Mandate } from '@/models/mandate';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization api
const mandateApi = entityApi.entitySliceApi['mandates'];

export const mandateSliceApi: typeof EntitySliceApi =
  createEntitySlice<Mandate>(mandateApi as any, 'mandates');

export const { useListQuery } = mandateSliceApi;
