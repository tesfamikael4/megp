import { configureStore } from '@reduxjs/toolkit';
import entityApi from './entity/api';
import { preBudgetPlanApi } from './api/pre-budget-plan/pre-budget-plan.api';
import { postBudgetPlanApi } from './api/post-budget-plan/post-budget-plan.api';
import { administrationApi } from './api/administration/administration.api';
import { planningApprovalApi } from './api/planning-approval/planning-approval';
import { planningIamApi } from './api/planning-approval/planning-iam';
import { iamApi } from './api/iam/iam.api';
import { workflowApi } from './api/workflow/workflow.api';
import { ruleApi } from './api/rule-designer/rule-designer';
import { reasonApi } from './api/reason/reason.api';

const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [preBudgetPlanApi.reducerPath]: preBudgetPlanApi.reducer,
    [postBudgetPlanApi.reducerPath]: postBudgetPlanApi.reducer,
    [administrationApi.reducerPath]: administrationApi.reducer,
    [iamApi.reducerPath]: iamApi.reducer,
    [workflowApi.reducerPath]: workflowApi.reducer,
    [planningApprovalApi.reducerPath]: planningApprovalApi.reducer,
    [planningIamApi.reducerPath]: planningIamApi.reducer,
    [ruleApi.reducerPath]: ruleApi.reducer,
    [reasonApi.reducerPath]: reasonApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ...middleware,
      preBudgetPlanApi.middleware,
      postBudgetPlanApi.middleware,
      administrationApi.middleware,
      iamApi.middleware,
      workflowApi.middleware,
      planningApprovalApi.middleware,
      planningIamApi.middleware,
      ruleApi.middleware,
      reasonApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
