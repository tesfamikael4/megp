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
  emailPasswordSignIn,
  updateEmailOrPassword,
} from 'supertokens-node/recipe/thirdpartyemailpassword';
import { OrganizationService } from 'src/organization';
import {
  CheckSecurityQuestionDto,
  SetSecurityQuestionDto,
} from 'src/organization/dto/security-question.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly organizationService: OrganizationService) {}

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

  @Post('set-security-questions')
  @UseGuards(new AuthGuard())
  async setSecurityQuestions(
    @Body() payload: SetSecurityQuestionDto,
    @Session() session: SessionContainer,
  ): Promise<any> {
    return await this.organizationService.setSecurityQuestions(
      session.getUserId(),
      payload,
    );
  }

  @Post('check-security-questions')
  async checkSecurityQuestions(
    @Body() payload: CheckSecurityQuestionDto,
  ): Promise<any> {
    return await this.organizationService.checkSecurityQuestions(payload);
  }

  @Get('security-questions')
  @UseGuards(new AuthGuard())
  async getSecurityQuestions(
    @Session() session: SessionContainer,
  ): Promise<any> {
    return await this.organizationService.getSecurityQuestions(
      session.getUserId(),
    );
  }

  @Get('userinfo')
  @UseGuards(new AuthGuard())
  async userinfo(@Session() session: SessionContainer): Promise<any> {
    return await this.organizationService.getUserInfo(session.getUserId());
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
