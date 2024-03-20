import { SetMetadata } from '@nestjs/common';

export const IGNORE_TENANT_INTERCEPTOR_KEY = 'IGNORE_TENANT_INTERCEPTOR';

export const IgnoreTenantInterceptor = () =>
  SetMetadata(IGNORE_TENANT_INTERCEPTOR_KEY, true);
