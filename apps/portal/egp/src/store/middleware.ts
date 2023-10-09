/* Core */

import { authApi } from './api/auth/auth.api';
import { vendorRegistrationSlice } from './api/vendor_registration/slice';

const middleware = [vendorRegistrationSlice.middleware, authApi.middleware];

export { middleware };
