/* Core */

import { extensionApi } from './api/guarantee-extension/extension.api';
import { guaranteeApi } from './api/guarantee/guarantee.api';
import { organazationApi, unitApi } from './api/organazation/organazation.api';
import { preferentialTreatmentApi } from './api/preferential-treatment/preferential-treatment.api';
import { vendorUpgradeApi } from './api/vendor-upgrade/api';
import {
  vendorDataGetawayApi,
  vendorRegistrationApi,
} from './api/vendor_registration/api';

const middleware = [
  vendorRegistrationApi.middleware,
  vendorDataGetawayApi.middleware,
  vendorUpgradeApi.middleware,
  preferentialTreatmentApi.middleware,
  organazationApi.middleware,
  unitApi.middleware,
  guaranteeApi.middleware,
  extensionApi.middleware,
];

export { middleware };
