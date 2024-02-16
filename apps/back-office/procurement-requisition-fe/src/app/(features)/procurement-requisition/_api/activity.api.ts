import { ProcurementRequisition } from '@/models/procurement-requsition';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const itemsApi = entityApi.entitySliceApi['annual-procurement-plan-activities'];

export const itemsSliceApi: typeof EntitySliceApi =
  createEntitySlice<ProcurementRequisition>(
    itemsApi as any,
    'annual-procurement-plan-activities',
  );

export const { useLazyListByIdQuery, useLazyReadQuery, useReadQuery } =
  itemsSliceApi;
