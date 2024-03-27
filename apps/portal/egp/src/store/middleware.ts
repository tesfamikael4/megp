/* Core */

import { getTendersApi } from '@/app/(features)/vendor/tender/_api/tender.api';
import { extensionApi } from './api/guarantee-extension/extension.api';
import { guaranteeApi } from './api/guarantee/guarantee.api';
import { organazationApi, unitApi } from './api/organazation/organazation.api';
import { preferentialTreatmentApi } from './api/preferential-treatment/preferential-treatment.api';
import { vendorUpgradeApi } from './api/vendor-upgrade/api';
import {
  vendorDataGetawayApi,
  vendorRegistrationApi,
} from './api/vendor_registration/api';
import { invitationDocumentApi } from '@/app/(features)/vendor/tender/_api/invitation-document.api';
import { registrationApi } from '@/app/(features)/vendor/tender/_api/register.api';
import { bookmarkApi } from '@/app/(features)/vendor/tender/_api/bookmark.api';
import { getBookmarkApi } from '@/app/(features)/vendor/_api/bookmark.api';
import { getRegistrationApi } from '@/app/(features)/vendor/_api/registration.api';
import { getItemsApi } from '@/app/(features)/vendor/_api/item.api';
import { checkPasswordApi } from '@/app/(features)/vendor/_api/bid-response.api';

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
];

export { middleware };
