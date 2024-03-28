import { TenderClassification } from '@/models/tender/tender-classification.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base tenderClassification api
const tenderClassificationApi =
  entityApi.entitySliceApi['tender-classifications'];

export const tenderClassificationSliceApi: typeof EntitySliceApi =
  createEntitySlice<TenderClassification>(
    tenderClassificationApi,
    'tender-classifications',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = tenderClassificationSliceApi;
