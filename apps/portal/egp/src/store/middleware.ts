/* Core */

import { authApi } from './api/auth/auth.api';
import {
  vendorDataGetawayApi,
  vendorRegistrationApi,
} from './api/vendor_registration/api';

const middleware = [
  vendorRegistrationApi.middleware,
  vendorDataGetawayApi.middleware,
  authApi.middleware,
];

export { middleware };
