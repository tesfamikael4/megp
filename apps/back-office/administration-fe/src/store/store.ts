import { configureStore } from '@reduxjs/toolkit';
import entityApi from './entity/api';
import { measurementsApi } from './api/measurements/measurements.api';
import { tagsApi } from './api/tags/tags.api';
import { categoriesApi } from './api/categories/categories.api';

const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [measurementsApi.reducerPath]: measurementsApi.reducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ...middleware,
      measurementsApi.middleware,
      tagsApi.middleware,
      categoriesApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
