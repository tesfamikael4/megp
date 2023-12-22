import { configureStore } from '@reduxjs/toolkit';
import { newRegistrationSlice } from './api/vendor_request_handler/new-registration-api';
import entityApi from './entity/api';
import { serviceApi } from '@/store/api/service/service.api';
import { approvedRejectedApi } from './api/vendor_request_handler/approved-rejected-api';

const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [newRegistrationSlice.reducerPath]: newRegistrationSlice.reducer,
    [approvedRejectedApi.reducerPath]: approvedRejectedApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ...middleware,
      newRegistrationSlice.middleware,
      serviceApi.middleware,
      approvedRejectedApi.middleware,
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
