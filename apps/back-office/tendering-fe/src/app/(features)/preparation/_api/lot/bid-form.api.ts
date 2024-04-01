import { SpdTechnicalScoring } from '@/models/spd/technical-scoring';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base bidForm api
const bidFormApi = entityApi.entitySliceApi['spd-bid-form'];

export const bidFormSliceApi: typeof EntitySliceApi =
  createEntitySlice<SpdTechnicalScoring>(bidFormApi, 'spd-bid-forms');

export const { useLazyListByIdQuery } = bidFormSliceApi;
