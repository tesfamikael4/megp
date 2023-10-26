import { configureStore } from '@reduxjs/toolkit';
import entityApi from './entity/api';
import { orgPermissionApi } from './api/other/org-permission.api';
import { userRelationApi } from './api/other/user-relation';
import { permissionApi } from './api/other/permission.api';
import { adressApi } from './api/other/adress.api';

const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [orgPermissionApi.reducerPath]: orgPermissionApi.reducer,
    [userRelationApi.reducerPath]: userRelationApi.reducer,
    [permissionApi.reducerPath]: permissionApi.reducer,
    [adressApi.reducerPath]: adressApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ...middleware,
      orgPermissionApi.middleware,
      userRelationApi.middleware,
      permissionApi.middleware,
      adressApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
