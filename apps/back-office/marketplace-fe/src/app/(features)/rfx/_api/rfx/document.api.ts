import { Document } from '@/models/tender/document.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base document api
const documentApi = entityApi.entitySliceApi['sor-documents'];

export const documentSliceApi: typeof EntitySliceApi =
  createEntitySlice<Document>(documentApi, 'sor-documents');

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = documentSliceApi;
