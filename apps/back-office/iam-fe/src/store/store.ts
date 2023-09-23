import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './api/user/user.api';
import { organizationApi } from './api/organization/organization.api';
import { entityListReducer } from '@/shared/entity-list/store/entity-list.slice';
import { unitApi } from './api/unit/unit.api';
import { roleApi } from './api/role/role.api';
import { organizationTypeApi } from './api/lookUps/lookups.api';

import { organizationSectorApi } from './api/orgSector/orgSector.api';
import { applicationApi } from './api/application/application.api';
import { sectorApi } from './api/sector/sector.api';
import { UnitTypeApi } from './api/unitType/unitType.api';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [unitApi.reducerPath]: unitApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [organizationTypeApi.reducerPath]: organizationTypeApi.reducer,
    [applicationApi.reducerPath]: applicationApi.reducer,

    [organizationSectorApi.reducerPath]: organizationSectorApi.reducer,
    [sectorApi.reducerPath]: sectorApi.reducer,
    [UnitTypeApi.reducerPath]: UnitTypeApi.reducer,

    entityList: entityListReducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [unitApi.reducerPath]: unitApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      organizationApi.middleware,
      unitApi.middleware,
      roleApi.middleware,
      organizationTypeApi.middleware,
      applicationApi.middleware,
      organizationSectorApi.middleware,
      sectorApi.middleware,
      UnitTypeApi.middleware,
      roleApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
