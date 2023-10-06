import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './api/user/user.api';
import { newRegistrationSlice } from './api/vendor_request_handler/new_registration_slice';
import entityApi from './entity/api';
import { serviceApi } from '@/store/api/service/service.api';

const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [userApi.reducerPath]: userApi.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [newRegistrationSlice.reducerPath]: newRegistrationSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ...middleware,
      newRegistrationSlice.middleware,
      serviceApi.middleware,
    ]),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
