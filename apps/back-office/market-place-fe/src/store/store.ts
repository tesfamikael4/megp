import { configureStore } from '@reduxjs/toolkit';
import entityApi from './entity/api';
import { prApi } from './api/pr/pr.api';
import { rfxApi } from './api/rfx/rfx.api';

const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [prApi.reducerPath]: prApi.reducer,
    [rfxApi.reducerPath]: rfxApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ...middleware,
      prApi.middleware,
      rfxApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
