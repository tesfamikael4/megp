import { ContractPaymentScheduleForm } from '@/models/contract-condition/contract-payment-schedule.mode';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base payment schedules api
const paymentSchedulesApi = entityApi.entitySliceApi['scc-payment-schedules'];

export const paymentSchedulesSliceApi: typeof EntitySliceApi =
  createEntitySlice<ContractPaymentScheduleForm>(
    paymentSchedulesApi,
    'scc-payment-schedules',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = paymentSchedulesSliceApi;
