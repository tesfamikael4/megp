import { configureStore } from '@reduxjs/toolkit';
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
import { getTendersApi } from '@/app/(features)/procurement-notice/_api/tender.api';
import { invitationDocumentApi } from '@/app/(features)/procurement-notice/_api/invitation-document.api';
import { registrationApi } from '@/app/(features)/procurement-notice/_api/register.api';
import { bookmarkApi } from '@/app/(features)/procurement-notice/_api/bookmark.api';
import { getBookmarkApi } from '@/app/(features)/my-workspace/_api/bookmark.api';
import { getItemsApi } from '@/app/(features)/vendor/_api/item.api';
import { checkPasswordApi } from '@/app/(features)/vendor/_api/bid-response.api';
import { bidApi } from './api/registered-bid/registered-bid.api';
import { getTenderSpdApi } from '@/app/(features)/vendor/_api/tender-spd';
import { getBidFormApi } from '@/app/(features)/vendor/_api/bid-form';
import { publicVendorsApi } from '@/app/(features)/_api/vendors.api';
import { getRegistrationApi } from '@/app/(features)/_api/registration.api';
import { ItemBidResponseApi } from '@/app/(features)/tender-workspace/_api/item-bid-response.api';
import { administrationApi } from './api/administrationApi';
import { noteSliceApi } from './api/notes/notes.api';
import { getCatalogApi } from '@/app/(features)/my-workspace/catalog-manager/_api/catalog.api';
import { itemMasterApi } from './api/item-master/item-master.api';
import {
  getBds,
  getVenderList,
} from '@/app/(features)/tender-workspace/_api/bid-attribute-datas';
import { tenderResponseApi } from '@/app/(features)/tender-workspace/_api/tender-bid-response.api';
import { lotResponseApi } from '@/app/(features)/tender-workspace/_api/lot-bid-response.api';

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
    [ItemBidResponseApi.reducerPath]: ItemBidResponseApi.reducer,
    [administrationApi.reducerPath]: administrationApi.reducer,
    [noteSliceApi.reducerPath]: noteSliceApi.reducer,
    [itemMasterApi.reducerPath]: itemMasterApi.reducer,
    [getCatalogApi.reducerPath]: getCatalogApi.reducer,
    [getVenderList.reducerPath]: getVenderList.reducer,
    [getBds.reducerPath]: getBds.reducer,
    [tenderResponseApi.reducerPath]: tenderResponseApi.reducer,
    [lotResponseApi.reducerPath]: lotResponseApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      ...middleware,
      getCatalogApi.middleware,
      itemMasterApi.middleware,
    );
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
