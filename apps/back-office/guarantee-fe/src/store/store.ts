import { configureStore } from '@reduxjs/toolkit';
import entityApi from './entity/api';
import { vendorApi } from './api/vendor/vendor.api';
import { statusApi } from './api/status/status.api';
import { organazationApi } from './api/organazation/organazation.api';
import { forfeitApi } from './api/guarantee-forfeit/guarantee-forfeit.api';
import { guaranteeApprovalApi } from './api/approval/approval';
import { guaranteeIamApi } from './api/approval/iam';
import { workflowApi } from './api/workflow/workflow.api';
import { guaranteeApi } from './api/guarantee-request/guarantee-request.api';
import { guaranteeDocumentApi } from './api/guarantee-document/guarantee-document.api';
const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [vendorApi.reducerPath]: vendorApi.reducer,
    [statusApi.reducerPath]: statusApi.reducer,
    [organazationApi.reducerPath]: organazationApi.reducer,
    [forfeitApi.reducerPath]: forfeitApi.reducer,
    [guaranteeApprovalApi.reducerPath]: guaranteeApprovalApi.reducer,
    [guaranteeIamApi.reducerPath]: guaranteeIamApi.reducer,
    [workflowApi.reducerPath]: workflowApi.reducer,
    [guaranteeApi.reducerPath]: guaranteeApi.reducer,
    [guaranteeDocumentApi.reducerPath]: guaranteeDocumentApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ...middleware,
      vendorApi.middleware,
      statusApi.middleware,
      organazationApi.middleware,
      forfeitApi.middleware,
      guaranteeApprovalApi.middleware,
      workflowApi.middleware,
      guaranteeIamApi.middleware,
      guaranteeApi.middleware,
      guaranteeDocumentApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
