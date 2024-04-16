import { SpdDocumentaryEvidence } from '@/models/spd/documentary-evidence.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base spdDocumentaryEvidence api
const spdDocumentaryEvidenceApi =
  entityApi.entitySliceApi['spd-documentary-evidences'];

export const spdDocumentaryEvidenceSliceApi: typeof EntitySliceApi =
  createEntitySlice<SpdDocumentaryEvidence>(
    spdDocumentaryEvidenceApi,
    'spd-documentary-evidences',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = spdDocumentaryEvidenceSliceApi;
