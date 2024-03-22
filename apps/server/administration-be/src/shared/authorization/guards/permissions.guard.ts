import { CanActivate, ExecutionContext, Type } from '@nestjs/common';
import { CurrentUserDto } from '../models/auth.model';

export function PermissionsGuard(permissions: string): Type<CanActivate> {
  class PermissionsGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const requiredPermissions = permissions.split('|');
      if (requiredPermissions.length < 1) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const user: CurrentUserDto = request.user;
      const userPermissions = user?.permissions;

      return requiredPermissions.some((requiredPermission) =>
        userPermissions?.find((x: any) => x == requiredPermission.trim()),
      );
    }
  }

  return PermissionsGuardMixin;
}
