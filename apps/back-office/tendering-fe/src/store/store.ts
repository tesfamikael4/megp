import { configureStore } from '@reduxjs/toolkit';
import entityApi from './entity/api';
import { budgetApi } from './api/budget/budget-year.api';
import { postBudgetPlanApi } from './api/requsition';
import { administrationApi } from './api/administration/administration.api';

const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [budgetApi.reducerPath]: budgetApi.reducer,
    [postBudgetPlanApi.reducerPath]: postBudgetPlanApi.reducer,
    [administrationApi.reducerPath]: administrationApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ...middleware,
      budgetApi.middleware,
      postBudgetPlanApi.middleware,
      administrationApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
