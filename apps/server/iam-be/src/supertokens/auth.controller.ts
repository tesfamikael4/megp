import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard, PermissionsGuard } from './auth/guards';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { AllowAnonymous, Session } from './auth/decorators';
import {
  createResetPasswordToken,
  emailPasswordSignIn,
  resetPasswordUsingToken,
  updateEmailOrPassword,
} from 'supertokens-node/recipe/thirdpartyemailpassword';
import { UserAuthService } from 'src/users/services/user-auth.service';
import {
  CheckSecurityQuestionDto,
  SetSecurityQuestionDto,
} from 'src/users/dto/security-question.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post('change-password')
  @UseGuards(new AuthGuard())
  async changePassword(
    @Body() payload: { oldPassword: string; newPassword: string },
    @Session() session: SessionContainer,
  ): Promise<any> {
    if (payload.newPassword === payload.oldPassword) {
      throw new Error('New password cannot be the same as old one');
    }

    const user = session.getAccessTokenPayload();

    const isPasswordValid = await emailPasswordSignIn(
      session!.getTenantId(),
      user.userInfo.username,
      payload.oldPassword,
    );

    if (isPasswordValid.status !== 'OK') {
      throw new HttpException(
        'INVALID_USERNAME_OR_PASSWORD',
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = await updateEmailOrPassword({
      userId: isPasswordValid.user.id,
      password: payload.newPassword,
      tenantIdForPasswordPolicy: session!.getTenantId(),
    });

    if (response.status === 'PASSWORD_POLICY_VIOLATED_ERROR') {
      throw new HttpException(
        'PASSWORD_POLICY_VIOLATED_ERROR',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('password-reset')
  async passwordReset(
    @Body()
    payload: {
      superTokenUserId: string;
      token: string;
      password: string;
    },
  ) {
    const response = await resetPasswordUsingToken(
      'public',
      payload.token,
      payload.password,
    );

    return response;
  }

  @Post('set-security-questions')
  @UseGuards(new AuthGuard())
  async setSecurityQuestions(
    @Body() payload: SetSecurityQuestionDto,
    @Session() session: SessionContainer,
  ): Promise<any> {
    const user = session.getAccessTokenPayload();

    const isPasswordValid = await emailPasswordSignIn(
      session!.getTenantId(),
      user.userInfo.username,
      payload.password,
    );

    if (isPasswordValid.status !== 'OK') {
      throw new HttpException('INVALID_PASSWORD', HttpStatus.BAD_REQUEST);
    }

    return await this.userAuthService.setSecurityQuestions(
      session.getUserId(),
      payload,
    );
  }

  @Post('check-security-questions')
  async checkSecurityQuestions(
    @Body() payload: CheckSecurityQuestionDto,
  ): Promise<any> {
    const result = await this.userAuthService.checkSecurityQuestions(payload);
    if (result.status) {
      const token = await createResetPasswordToken(
        'public',
        result.superTokenUserId,
      );
      if (token.status === 'OK') {
        result['token'] = token.token;

        return result;
      }
    }

    return result;
  }

  @Get('security-questions')
  @UseGuards(new AuthGuard())
  async getSecurityQuestions(
    @Session() session: SessionContainer,
  ): Promise<any> {
    return await this.userAuthService.getSecurityQuestions(session.getUserId());
  }

  @Get('userinfo')
  @UseGuards(new AuthGuard())
  async userinfo(@Session() session: SessionContainer): Promise<any> {
    return await this.userAuthService.getUserInfo(session.getUserId());
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
