import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './api/user/user.api';
import { newRegistrationSlice } from './api/vendor_request_handler/new_registration_slice';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [newRegistrationSlice.reducerPath]: newRegistrationSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([newRegistrationSlice.middleware]),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
