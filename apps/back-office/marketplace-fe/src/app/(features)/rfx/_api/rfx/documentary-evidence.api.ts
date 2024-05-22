import { DocumentaryEvidence } from '@/models/tender/documentary-evidence.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base documentEvidence api
const documentaryEvidenceApi =
  entityApi.entitySliceApi['rfx-documentary-evidences'];

export const documentaryEvidenceSliceApi: typeof EntitySliceApi =
  createEntitySlice<DocumentaryEvidence>(
    documentaryEvidenceApi,
    'rfx-documentary-evidences',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = documentaryEvidenceSliceApi;
