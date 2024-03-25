import { configureStore } from '@reduxjs/toolkit';
import entityApi from './entity/api';
import { vendorApi } from './api/vendor/vendor.api';
import { statusApi } from './api/status/status.api';
import { organazationApi } from './api/organazation/organazation.api';
const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [vendorApi.reducerPath]: vendorApi.reducer,
    [statusApi.reducerPath]: statusApi.reducer,
    [organazationApi.reducerPath]: organazationApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ...middleware,
      vendorApi.middleware,
      statusApi.middleware,
      organazationApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
