import { RevisionApproval } from '@/models/revision/revision.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const revisionApprovalApi = entityApi.entitySliceApi['revision-approvals'];

export const revisionApprovalSliceApi: typeof EntitySliceApi =
  createEntitySlice<RevisionApproval>(
    revisionApprovalApi as any,
    'revision-approvals',
  );

export const {
  useListQuery,
  useListByAppIdQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useLazyReadQuery,
  useLazyListQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = revisionApprovalSliceApi;
