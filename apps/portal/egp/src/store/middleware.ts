/* Core */

import { getTendersApi } from '@/app/(features)/procurement-notice/_api/tender.api';
import { extensionApi } from './api/guarantee-extension/extension.api';
import { guaranteeApi } from './api/guarantee/guarantee.api';
import { organazationApi, unitApi } from './api/organazation/organazation.api';
import { preferentialTreatmentApi } from './api/preferential-treatment/preferential-treatment.api';
import { vendorUpgradeApi } from './api/vendor-upgrade/api';
import {
  vendorDataGetawayApi,
  vendorRegistrationApi,
} from './api/vendor_registration/api';
import { invitationDocumentApi } from '@/app/(features)/procurement-notice/_api/invitation-document.api';
import { registrationApi } from '@/app/(features)/procurement-notice/_api/register.api';
import { bookmarkApi } from '@/app/(features)/procurement-notice/_api/bookmark.api';
import { getBookmarkApi } from '@/app/(features)/my-workspace/_api/bookmark.api';
import { getItemsApi } from '@/app/(features)/vendor/_api/item.api';
import { checkPasswordApi } from '@/app/(features)/vendor/_api/bid-response.api';
import { bidApi } from './api/registered-bid/registered-bid.api';
import { getBidFormApi } from '@/app/(features)/vendor/_api/bid-form';
import { getTenderSpdApi } from '@/app/(features)/vendor/_api/tender-spd';
import { publicVendorsApi } from '@/app/(features)/_api/vendors.api';
import { getRegistrationApi } from '@/app/(features)/_api/registration.api';
import { ItemBidResponseApi } from '@/app/(features)/tender-workspace/_api/item-bid-response.api';
import { administrationApi } from './api/administrationApi';
import { noteSliceApi } from './api/notes/notes.api';
import {
  getBds,
  getVenderList,
} from '@/app/(features)/tender-workspace/_api/bid-attribute-datas';
import { tenderResponseApi } from '@/app/(features)/tender-workspace/_api/tender-bid-response.api';
import { lotResponseApi } from '@/app/(features)/tender-workspace/_api/lot-bid-response.api';

const middleware = [
  vendorRegistrationApi.middleware,
  vendorDataGetawayApi.middleware,
  vendorUpgradeApi.middleware,
  preferentialTreatmentApi.middleware,
  organazationApi.middleware,
  unitApi.middleware,
  guaranteeApi.middleware,
  extensionApi.middleware,
  getTendersApi.middleware,
  invitationDocumentApi.middleware,
  registrationApi.middleware,
  bookmarkApi.middleware,
  getBookmarkApi.middleware,
  getRegistrationApi.middleware,
  getItemsApi.middleware,
  checkPasswordApi.middleware,
  bidApi.middleware,
  getBidFormApi.middleware,
  getTenderSpdApi.middleware,
  publicVendorsApi.middleware,
  ItemBidResponseApi.middleware,
  administrationApi.middleware,
  noteSliceApi.middleware,
  getVenderList.middleware,
  getBds.middleware,
  tenderResponseApi.middleware,
  lotResponseApi.middleware,
];

export { middleware };
