// import { ExecutionContext, Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { Reflector } from '@nestjs/core';
// import { ALLOW_ANONYMOUS_META_KEY } from '../decorators/allow-anonymous.decorator';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   constructor(private readonly reflector: Reflector) {
//     super();
//   }

//   canActivate(context: ExecutionContext) {
//     const isAnonymousAllowed = this.reflector?.getAllAndOverride<boolean>(
//       ALLOW_ANONYMOUS_META_KEY,
//       [context.getHandler(), context.getClass()],
//     );
//     if (isAnonymousAllowed) {
//       return true;
//     }

//     return super.canActivate(context);
//   }
// }
