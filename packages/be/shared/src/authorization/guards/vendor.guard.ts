import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Type,
} from '@nestjs/common';

export function VendorGuard(): Type<CanActivate> {
  class VendorGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const user: any = request.user;
      const organization = user?.organization;

      if (organization?.id != null) {
        return true;
      }

      throw new ForbiddenException('vendor_registration_not_completed');
    }
  }

  return VendorGuardMixin;
}
