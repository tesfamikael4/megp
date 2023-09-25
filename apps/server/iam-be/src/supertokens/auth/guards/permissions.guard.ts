import { CanActivate, ExecutionContext, Type } from '@nestjs/common';
import { SessionContainer } from 'supertokens-node/recipe/session';

export function PermissionsGuard(permissions: string): Type<CanActivate> {
  class PermissionsGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const requiredPermissions = permissions.split('|');
      if (requiredPermissions.length < 1) {
        return true;
      }

      const request = context.switchToHttp().getRequest();

      const payload: SessionContainer = request.session.userDataInAccessToken;

      const userPermissions = payload['st-perm']?.v;

      return requiredPermissions.some(
        (requiredPermission) =>
          userPermissions?.includes(requiredPermission.trim()),
      );
    }
  }

  return PermissionsGuardMixin;
}
