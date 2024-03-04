import { ReimburseableExpense } from '@/models/tender/lot/item/reimburseable-expense.model';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base reimburseableExpense api
const reimburseableExpenseApi =
  entityApi.entitySliceApi['sor-reimburseable-expenses'];

export const reimburseableExpenseSliceApi: typeof EntitySliceApi =
  createEntitySlice<ReimburseableExpense>(
    reimburseableExpenseApi,
    'sor-reimburseable-expense',
  );

export const {
  useListQuery,
  useLazyListQuery,
  useLazyListByIdQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = reimburseableExpenseSliceApi;
