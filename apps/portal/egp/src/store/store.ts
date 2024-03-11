import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './api/user/user.api';
import {
  vendorDataGetawayApi,
  vendorRegistrationApi,
} from './api/vendor_registration/api';
import { middleware } from './middleware';
import { vendorUpgradeApi } from './api/vendor-upgrade/api';
import { preferentialTreatmentApi } from './api/preferential-treatment/preferential-treatment.api';
import { organazationApi, unitApi } from './api/organazation/organazation.api';

export const store = configureStore({
  reducer: {
    [vendorRegistrationApi.reducerPath]: vendorRegistrationApi.reducer,
    [vendorDataGetawayApi.reducerPath]: vendorDataGetawayApi.reducer,
    [vendorUpgradeApi.reducerPath]: vendorUpgradeApi.reducer,
    [preferentialTreatmentApi.reducerPath]: preferentialTreatmentApi.reducer,
    [organazationApi.reducerPath]: organazationApi.reducer,
    [unitApi.reducerPath]: unitApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    }).concat(middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
