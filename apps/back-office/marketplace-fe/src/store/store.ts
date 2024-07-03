import { configureStore } from '@reduxjs/toolkit';
import entityApi from './entity/api';
import { sorDocumentApi } from '@/app/(features)/rfx/_api/rfx/sor-document.api';
import { rfxIamApi } from './api/rfx-approval/rfx-iam';
import { workflowApi } from './api/rfx-approval/workflow.api';
import { rfxApprovalApi } from './api/rfx-approval/rfx-approval';
import { rfxOtherApi } from './api/rfx/rfx.api';
import { itemOtherApi } from './api/rfx/item.api';
import { evaluationApprovalApi } from './api/rfx/eval-approval.api';
import { poApi } from './api/po-preparation/po-preparation.api';
import { prApi } from './api/rfx/pr.api';

const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [rfxOtherApi.reducerPath]: rfxOtherApi.reducer,
    [sorDocumentApi.reducerPath]: sorDocumentApi.reducer,
    [rfxIamApi.reducerPath]: rfxIamApi.reducer,
    [workflowApi.reducerPath]: workflowApi.reducer,
    [rfxApprovalApi.reducerPath]: rfxApprovalApi.reducer,
    [itemOtherApi.reducerPath]: itemOtherApi.reducer,
    [evaluationApprovalApi.reducerPath]: evaluationApprovalApi.reducer,
    [poApi.reducerPath]: poApi.reducer,
    [prApi.reducerPath]: prApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ...middleware,
      rfxOtherApi.middleware,
      sorDocumentApi.middleware,
      rfxIamApi.middleware,
      workflowApi.middleware,
      rfxApprovalApi.middleware,
      itemOtherApi.middleware,
      evaluationApprovalApi.middleware,
      poApi.middleware,
      prApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
