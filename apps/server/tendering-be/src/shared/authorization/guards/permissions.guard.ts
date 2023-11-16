import { CanActivate, ExecutionContext, Type } from '@nestjs/common';

export function PermissionsGuard(permissions: string): Type<CanActivate> {
  class PermissionsGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const requiredRoles = permissions.split('|');
      if (requiredRoles.length < 1) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const roles: string[] = request.user;

      // return requiredRoles.some((requiredPermission) =>
      //   roles?.includes(requiredPermission.trim())
      // );

      return true;
    }
  }

  return PermissionsGuardMixin;
}
