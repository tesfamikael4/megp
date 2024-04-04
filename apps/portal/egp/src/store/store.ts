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
import { guaranteeApi } from './api/guarantee/guarantee.api';
import { extensionApi } from './api/guarantee-extension/extension.api';
import { getTendersApi } from '@/app/(features)/vendor/tender/_api/tender.api';
import { invitationDocumentApi } from '@/app/(features)/vendor/tender/_api/invitation-document.api';
import { registrationApi } from '@/app/(features)/vendor/tender/_api/register.api';
import { bookmarkApi } from '@/app/(features)/vendor/tender/_api/bookmark.api';
import { getBookmarkApi } from '@/app/(features)/vendor/_api/bookmark.api';
import { getRegistrationApi } from '@/app/(features)/vendor/_api/registration.api';
import { getItemsApi } from '@/app/(features)/vendor/_api/item.api';
import { checkPasswordApi } from '@/app/(features)/vendor/_api/bid-response.api';
import { bidApi } from './api/registered-bid/registered-bid.api';
import { getTenderSpdApi } from '@/app/(features)/vendor/_api/tender-spd';
import { getBidFormApi } from '@/app/(features)/vendor/_api/bid-form';
import { publicVendorsApi } from '@/app/(features)/_api/vendors.api';

export const store = configureStore({
  reducer: {
    [vendorRegistrationApi.reducerPath]: vendorRegistrationApi.reducer,
    [vendorDataGetawayApi.reducerPath]: vendorDataGetawayApi.reducer,
    [vendorUpgradeApi.reducerPath]: vendorUpgradeApi.reducer,
    [preferentialTreatmentApi.reducerPath]: preferentialTreatmentApi.reducer,
    [organazationApi.reducerPath]: organazationApi.reducer,
    [unitApi.reducerPath]: unitApi.reducer,
    [guaranteeApi.reducerPath]: guaranteeApi.reducer,
    [extensionApi.reducerPath]: extensionApi.reducer,
    [getTendersApi.reducerPath]: getTendersApi.reducer,
    [invitationDocumentApi.reducerPath]: invitationDocumentApi.reducer,
    [registrationApi.reducerPath]: registrationApi.reducer,
    [bookmarkApi.reducerPath]: bookmarkApi.reducer,
    [getBookmarkApi.reducerPath]: getBookmarkApi.reducer,
    [getRegistrationApi.reducerPath]: getRegistrationApi.reducer,
    [getItemsApi.reducerPath]: getItemsApi.reducer,
    [checkPasswordApi.reducerPath]: checkPasswordApi.reducer,
    [bidApi.reducerPath]: bidApi.reducer,
    [getBidFormApi.reducerPath]: getBidFormApi.reducer,
    [getTenderSpdApi.reducerPath]: getTenderSpdApi.reducer,
    [publicVendorsApi.reducerPath]: publicVendorsApi.reducer,
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
