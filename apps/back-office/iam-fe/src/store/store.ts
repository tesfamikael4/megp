import { configureStore } from '@reduxjs/toolkit';
import entityApi from './entity/api';
import { mandateApi } from './api/other/mandate.api';
import { userRelationApi } from './api/other/user-relation';

const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [mandateApi.reducerPath]: mandateApi.reducer,
    [userRelationApi.reducerPath]: userRelationApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ...middleware,
      mandateApi.middleware,
      userRelationApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
