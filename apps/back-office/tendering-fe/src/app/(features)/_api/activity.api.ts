import { ProcurementRequisition } from '@/models/procurement-requsition';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base organization api
const itemsApi = entityApi.entitySliceApi['post-budget-plan-activities'];

export const itemsSliceApi: typeof EntitySliceApi =
  createEntitySlice<ProcurementRequisition>(
    itemsApi as any,
    'post-budget-plan-activities',
  );

export const { useLazyReadQuery } = itemsSliceApi;
