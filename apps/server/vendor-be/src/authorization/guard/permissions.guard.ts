import { CanActivate, ExecutionContext, Type } from '@nestjs/common';

export function PermissionsGuard(permissions: string): Type<CanActivate> {
  class PermissionsGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const requiredPermissions = permissions.split('|');
      if (requiredPermissions.length < 1) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const user = request.user;
      // if (user && user.organization) {
      //   const userPermissions = user.organization.permissions?.map(
      //     (permission: PermissionDto) => {
      //       return permission.key;
      //     }
      //   );
      //   return requiredPermissions.some((requiredPermission) =>
      //     userPermissions?.includes(requiredPermission.trim())
      //   );
      // }
      return true;
    }
  }

  return PermissionsGuardMixin;
}
