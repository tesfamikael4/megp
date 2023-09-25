import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './api/user/user.api';
import { entityListReducer } from '@/shared/entity-list/store/entity-list.slice';
import { pricingApi } from './api/pricing/pricing.api';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [pricingApi.reducerPath]: pricingApi.reducer,

    entityList: entityListReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pricingApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
