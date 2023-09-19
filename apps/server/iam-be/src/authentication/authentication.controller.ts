import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import UserRoles from 'supertokens-node/recipe/userroles';
import { AuthGuard } from './auth/guards';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { Session } from './auth/decorators/session.decorator';
import { PermissionsGuard } from './auth/guards';
import { AllowAnonymous } from './auth/decorators';

@Controller('authentications')
@ApiTags('authentications')
export class AuthenticationController {
  @Post()
  @AllowAnonymous()
  async create() {
    const response = await UserRoles.createNewRoleOrAddPermissions('account', [
      'read',
      'write',
    ]);

    if (response.createdNewRole === false) {
      // The role already exists
    }
  }

  @Post('assign')
  @AllowAnonymous()
  async assign() {
    const response = await UserRoles.addRoleToUser(
      'public',
      '49f7f922-86cb-442d-b315-c8e155e6d2d3',
      'account',
    );

    if (response.status === 'UNKNOWN_ROLE_ERROR') {
      // No such role exists
      return;
    }

    if (response.didUserAlreadyHaveRole === true) {
      // The user already had the role
    }
  }

  @Get('protected')
  @UseGuards(PermissionsGuard('oa|admin|write'))
  async getTest(@Session() session: SessionContainer): Promise<any> {
    return {
      userId: session.getUserId(),
      accessToken: session.getAccessToken(),
      accessTokenPayload: session.getAccessTokenPayload(),
    };
  }
}
