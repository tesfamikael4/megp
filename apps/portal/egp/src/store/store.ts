import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './api/user/user.api';
import { vendorRegistrationSlice } from './api/vendor_registration/slice';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [vendorRegistrationSlice.reducerPath]: vendorRegistrationSlice.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
