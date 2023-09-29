import { Body, Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard, PermissionsGuard } from './auth/guards';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { AllowAnonymous, Session } from './auth/decorators';
import { emailPasswordSignIn, updateEmailOrPassword } from 'supertokens-node/recipe/thirdpartyemailpassword';

@Controller('auth')
@ApiTags('auth')
export class AuthController {

  @Post('change-password')
  @UseGuards(new AuthGuard())
  async changePassword(@Body() payload: { oldPassword: string, newPassword: string }, @Session() session: SessionContainer): Promise<any> {
    if (payload.newPassword === payload.oldPassword) {
      throw new Error("New password cannot be the same as old one");
    }

    const user = session.getAccessTokenPayload();

    let isPasswordValid = await emailPasswordSignIn(session!.getTenantId(), user.userInfo.username, payload.oldPassword)

    if (isPasswordValid.status !== "OK") {
      throw new HttpException('INVALID_USERNAME_OR_PASSWORD', HttpStatus.BAD_REQUEST);
    }

    let response = await updateEmailOrPassword({
      userId: isPasswordValid.user.id,
      password: payload.newPassword,
      tenantIdForPasswordPolicy: session!.getTenantId()
    })

    if (response.status === "PASSWORD_POLICY_VIOLATED_ERROR") {
      throw new HttpException('PASSWORD_POLICY_VIOLATED_ERROR', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('protected')
  @UseGuards(PermissionsGuard('oa|admin|write'))
  @UseGuards(new AuthGuard())
  async getTest(@Session() session: SessionContainer): Promise<any> {
    return {
      userId: session.getUserId(),
      accessToken: session.getAccessToken(),
      accessTokenPayload: session.getAccessTokenPayload(),
    };
  }
}
