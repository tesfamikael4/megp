import { configureStore } from '@reduxjs/toolkit';
import entityApi from './entity/api';
import { budgetApi } from './api/budget/budget-year.api';
import { postBudgetPlanApi } from './api/requsition';
import { administrationApi } from './api/administration/administration.api';
import { customApi } from '@/app/(features)/_api/custom.api';
import { workflowApi } from './api/workflow/workflow.api';
import { prApprovalApi } from './api/planning-approval/planning-approval';
import { prIamApi } from './api/planning-approval/planning-iam';
import { approveSpdApi } from '@/app/(features)/spd/_api/approve-spd.api';
import { templateSpdApi } from '@/app/(features)/spd/_api/template-spd.api';
import { technicalScoringTreeApi } from '@/app/(features)/spd/_api/technical-scoring-tree.api';
import { approveTenderApi } from '@/app/(features)/preparation/_api/approve-tender.api';
const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [budgetApi.reducerPath]: budgetApi.reducer,
    [postBudgetPlanApi.reducerPath]: postBudgetPlanApi.reducer,
    [administrationApi.reducerPath]: administrationApi.reducer,
    [customApi.reducerPath]: customApi.reducer,
    [workflowApi.reducerPath]: workflowApi.reducer,
    [prApprovalApi.reducerPath]: prApprovalApi.reducer,
    [prIamApi.reducerPath]: prIamApi.reducer,
    [approveSpdApi.reducerPath]: approveSpdApi.reducer,
    [technicalScoringTreeApi.reducerPath]: technicalScoringTreeApi.reducer,
    [templateSpdApi.reducerPath]: templateSpdApi.reducer,
    [approveTenderApi.reducerPath]: approveTenderApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ...middleware,
      budgetApi.middleware,
      postBudgetPlanApi.middleware,
      administrationApi.middleware,
      customApi.middleware,
      workflowApi.middleware,
      prApprovalApi.middleware,
      prIamApi.middleware,
      approveSpdApi.middleware,
      technicalScoringTreeApi.middleware,
      templateSpdApi.middleware,
      approveTenderApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
