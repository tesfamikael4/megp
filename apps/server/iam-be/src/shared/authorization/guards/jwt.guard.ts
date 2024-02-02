import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ALLOW_ANONYMOUS_META_KEY } from '../decorators/allow-anonymous.decorator';
import { AuthHelper } from '../helper/auth.helper';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authHelper: AuthHelper,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isAnonymousAllowed = this.reflector?.getAllAndOverride<boolean>(
        ALLOW_ANONYMOUS_META_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (isAnonymousAllowed) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      const secret =
        process.env.JWT_ACCESS_TOKEN_SECRET ?? 'MAXWS4Fw5v6Dqvomjz7s';

      const user = await this.authHelper.verify(token, secret);
      const { organizations, ...rest } = user;
      let parsedUser: any = rest;
      if (organizations && organizations.length > 0) {
        let organization: any;

        if (request.headers && request.headers['x-organization-id']) {
          organization = organizations.find(
            (x: any) =>
              x.organization.id == request.headers['x-organization-id'],
          );
        } else {
          organization = organizations[0];
        }

        parsedUser = {
          ...parsedUser,
          ...organization,
        };
      }
      request.user = parsedUser;
      return true;
    } catch (error) {
      throw error;
    }
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
