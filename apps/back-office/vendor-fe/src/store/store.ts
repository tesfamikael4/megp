import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './api/user/user.api';
import { newRegistrationSlice } from './api/vendor_request_handler/new_registration_slice';

import { entityListReducer } from '@/shared/entity-list/store/entity-list.slice';
import { pricingApi } from './api/pricing/pricing.api';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [newRegistrationSlice.reducerPath]: newRegistrationSlice.reducer,

    [pricingApi.reducerPath]: pricingApi.reducer,

    entityList: entityListReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([pricingApi.middleware, newRegistrationSlice.middleware]),
  devTools: process.env.NODE_ENV !== 'production',


});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
