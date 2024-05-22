import { configureStore } from '@reduxjs/toolkit';
import entityApi from './entity/api';
import { rfxApi } from './api/rfx/rfx.api';
import { sorDocumentApi } from '@/app/(features)/rfx/_api/rfx/sor-document.api';
import { rfxIamApi } from './api/rfx-approval/rfx-iam';
import { workflowApi } from './api/rfx-approval/workflow.api';
import { rfxApprovalApi } from './api/rfx-approval/rfx-approval';

const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [rfxApi.reducerPath]: rfxApi.reducer,
    [sorDocumentApi.reducerPath]: sorDocumentApi.reducer,
    [rfxIamApi.reducerPath]: rfxIamApi.reducer,
    [workflowApi.reducerPath]: workflowApi.reducer,
    [rfxApprovalApi.reducerPath]: rfxApprovalApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ...middleware,
      rfxApi.middleware,
      sorDocumentApi.middleware,
      rfxIamApi.middleware,
      workflowApi.middleware,
      rfxApprovalApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
