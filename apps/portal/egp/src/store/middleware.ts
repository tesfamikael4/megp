/* Core */

import { authApi } from './api/auth/auth.api';
import { vendorRegistrationApi } from './api/vendor_registration/api';

const middleware = [vendorRegistrationApi.middleware, authApi.middleware];

export { middleware };
