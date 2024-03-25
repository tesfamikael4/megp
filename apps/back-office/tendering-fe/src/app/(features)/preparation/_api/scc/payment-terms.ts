import { PaymentTermsForm } from '@/models/contract-condition/contract-payment-terms-forms.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base payment terms api
const paymentTermsApi = entityApi.entitySliceApi['scc-payment-terms'];

export const paymentTermsSliceApi: typeof EntitySliceApi =
  createEntitySlice<PaymentTermsForm>(paymentTermsApi, 'scc-payment-terms');

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = paymentTermsSliceApi;
