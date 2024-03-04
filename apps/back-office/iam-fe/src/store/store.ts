import { configureStore } from '@reduxjs/toolkit';
import entityApi from './entity/api';
import { orgPermissionApi } from './api/other/org-permission.api';
import { administrationApi } from './api/administration/administration.api';

import { adressApi } from './api/other/adress.api';
import { invitationApi } from './api/other/invitation.api';

const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [orgPermissionApi.reducerPath]: orgPermissionApi.reducer,
    [administrationApi.reducerPath]: administrationApi.reducer,

    [adressApi.reducerPath]: adressApi.reducer,
    [invitationApi.reducerPath]: invitationApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ...middleware,
      orgPermissionApi.middleware,
      administrationApi.middleware,
      adressApi.middleware,
      invitationApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
