import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Error as STError } from 'supertokens-node';

import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import { VerifySessionOptions } from 'supertokens-node/recipe/session';
import { ALLOW_ANONYMOUS_META_KEY } from '../decorators/allow-anonymous.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector?: Reflector,
    private readonly verifyOptions?: VerifySessionOptions,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAnonymousAllowed = this.reflector?.getAllAndOverride<boolean>(
      ALLOW_ANONYMOUS_META_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isAnonymousAllowed) {
      return true;
    }

    const ctx = context.switchToHttp();

    let err = undefined;
    const resp = ctx.getResponse();
    // You can create an optional version of this by passing {sessionRequired: false} to verifySession
    await verifySession(this.verifyOptions)(ctx.getRequest(), resp, (res) => {
      err = res;
      return;
    });

    if (resp.headersSent) {
      throw new STError({
        message: 'RESPONSE_SENT',
        type: 'RESPONSE_SENT',
      });
    }

    if (err) {
      throw err;
    }


    const request = context.switchToHttp().getRequest();
    request['user'] = request.session.getAccessTokenPayload();

    return true;
  }
}
