import { configureStore } from '@reduxjs/toolkit';
import entityApi from './entity/api';
import { preBudgetPlanApi } from './api/pre-budget-plan/pre-budget-plan.api';
import { postBudgetPlanApi } from './api/post-budget-plan/post-budget-plan.api';
import { administrationApi } from './api/administration/administration.api';
import { iamApi } from './api/iam/iam.api';

const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [preBudgetPlanApi.reducerPath]: preBudgetPlanApi.reducer,
    [postBudgetPlanApi.reducerPath]: postBudgetPlanApi.reducer,
    [administrationApi.reducerPath]: administrationApi.reducer,
    [iamApi.reducerPath]: iamApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ...middleware,
      preBudgetPlanApi.middleware,
      postBudgetPlanApi.middleware,
      administrationApi.middleware,
      iamApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
