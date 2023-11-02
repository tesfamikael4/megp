/* Core */

import {
  vendorDataGetawayApi,
  vendorRegistrationApi,
} from './api/vendor_registration/api';

const middleware = [
  vendorRegistrationApi.middleware,
  vendorDataGetawayApi.middleware,
];

export { middleware };
