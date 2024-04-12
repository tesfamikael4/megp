import { configureStore } from '@reduxjs/toolkit';
import entityApi from './entity/api';

const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([...middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
