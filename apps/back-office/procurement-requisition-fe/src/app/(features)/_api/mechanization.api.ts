import { ProcurementRequisition } from '@/models/procurement-requsition';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization api
const organizationApi =
  entityApi.entitySliceApi['procurement-requisition-mechanisms'];

export const organizationSliceApi: typeof EntitySliceApi =
  createEntitySlice<ProcurementRequisition>(
    organizationApi as any,
    'procurement-requisition-mechanisms',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useListByIdQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListArchivedQuery,
  useRestoreMutation,
} = organizationSliceApi;
