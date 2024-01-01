/* Core */

import { vendorUpgradeApi } from './api/vendor-upgrade/api';
import {
  vendorDataGetawayApi,
  vendorRegistrationApi,
} from './api/vendor_registration/api';

const middleware = [
  vendorRegistrationApi.middleware,
  vendorDataGetawayApi.middleware,
  vendorUpgradeApi.middleware,
];

export { middleware };
