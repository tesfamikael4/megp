import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './api/user/user.api';
import { vendorRegistrationApi } from './api/vendor_registration/api';
import { middleware } from './middleware';
import { authApi } from './api/auth/auth.api';

export const store = configureStore({
  reducer: {
    [vendorRegistrationApi.reducerPath]: vendorRegistrationApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
