import { configureStore } from '@reduxjs/toolkit';
import entityApi from './entity/api';
import { budgetApi } from './api/budget/budget-year.api';
import { administrationApi } from './api/administration/administration.api';
import { customApi } from '@/app/(features)/_api/custom.api';
import { workflowApi } from './api/workflow/workflow.api';
import { prApprovalApi } from './api/planning-approval/planning-approval';
import { prIamApi } from './api/planning-approval/planning-iam';

const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [budgetApi.reducerPath]: budgetApi.reducer,
    [administrationApi.reducerPath]: administrationApi.reducer,
    [customApi.reducerPath]: customApi.reducer,
    [workflowApi.reducerPath]: workflowApi.reducer,
    [prApprovalApi.reducerPath]: prApprovalApi.reducer,
    [prIamApi.reducerPath]: prIamApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ...middleware,
      budgetApi.middleware,
      administrationApi.middleware,
      customApi.middleware,
      workflowApi.middleware,
      prApprovalApi.middleware,
      prIamApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
