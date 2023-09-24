/* Core */

import { vendorRegistrationSlice } from './api/vendor_registration/slice';

const middleware = [vendorRegistrationSlice.middleware];

export { middleware };
