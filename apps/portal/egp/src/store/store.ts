import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './api/user/user.api';
import { vendorRegistrationSlice } from './api/vendor_registration/slice';
import { middleware } from './middleware';
import { authApi } from './api/auth/auth.api';

export const store = configureStore({
  reducer: {
    [vendorRegistrationSlice.reducerPath]: vendorRegistrationSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
