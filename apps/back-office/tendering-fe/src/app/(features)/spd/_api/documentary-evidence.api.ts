import { SpdDocumentaryEvidence } from '@/models/spd/documentary-evidence.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base documentaryEvidence api
const documentaryEvidenceApi = entityApi.entitySliceApi['documentary-evidence'];

export const documentaryEvidenceSliceApi: typeof EntitySliceApi =
  createEntitySlice<SpdDocumentaryEvidence>(
    documentaryEvidenceApi,
    'spd-required-documentary-evidences',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = documentaryEvidenceSliceApi;
