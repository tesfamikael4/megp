import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { AccountsService } from '../services/account.service';
import { CreateAccountDto, VerifyAccountDto } from '../dto/account.dto';
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  LoginResponseDto,
  ResetPasswordDto,
} from '../dto/login.dto';
import { AllowAnonymous } from '../decorators/allow-anonymous.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import JwtRefreshGuard from '../guards/jwt-refresh.guard';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../guards/jwt.guard';
import {
  CheckSecurityQuestionDto,
  SetSecurityQuestionDto,
} from '../dto/security-question.dto';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly accountsService: AccountsService) { }

  @Post('signup')
  @AllowAnonymous()
  createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.createAccount(createAccountDto);
  }

  @Post('login')
  @AllowAnonymous()
  @HttpCode(200)
  @ApiResponse({ type: LoginResponseDto, isArray: false, status: 200 })
  login(@Body() loginDto: LoginDto) {
    return this.accountsService.login(loginDto);
  }

  @Post('verify')
  @AllowAnonymous()
  verifyAccount(@Body() verifyAccountDto: VerifyAccountDto) {
    return this.accountsService.verifyAccount(verifyAccountDto);
  }

  @Post('forget-password')
  @AllowAnonymous()
  forgetPassword(@Body() forgetPassword: ForgetPasswordDto) {
    return this.accountsService.forgetPassword(forgetPassword.email);
  }

  // @Post('verify-forget-password')
  // @AllowAnonymous()
  // verifyForgetPassword(@Body() verifyAccountDto: VerifyAccountDto) {
  //   return this.accountsService.verifyForgetPassword(verifyAccountDto);
  // }

  @Post('reset-password')
  @AllowAnonymous()
  resetPassword(@Body() resetPassword: ResetPasswordDto) {
    return this.accountsService.resetPassword(resetPassword);
  }

  @Post('change-password')
  @UseGuards(JwtGuard)
  changePassword(
    @Body() changePassword: ChangePasswordDto,
    @CurrentUser() user: any,
  ) {
    changePassword.accountId = user.id;
    return this.accountsService.changePassword(changePassword);
  }

  @Post('refresh-token')
  @AllowAnonymous()
  @UseGuards(JwtRefreshGuard)
  @ApiOkResponse({ type: LoginResponseDto, isArray: false, status: 200 })
  refreshToken(@Req() req: Request) {
    return this.accountsService.refreshToken(req);
  }

  @Post('set-security-questions')
  @UseGuards(JwtGuard)
  async setSecurityQuestions(
    @Body() payload: SetSecurityQuestionDto,
    @CurrentUser() user,
  ): Promise<any> {
    return await this.accountsService.setSecurityQuestions(user.id, payload);
  }

  @Post('check-security-questions')
  async checkSecurityQuestions(
    @Body() payload: CheckSecurityQuestionDto,
  ): Promise<any> {
    const result = await this.accountsService.checkSecurityQuestions(payload);
    if (result.status) {
      // const token = await createResetPasswordToken(
      //   'public',
      //   result.superTokenUserId,
      // );
      // if (token.status === 'OK') {
      //   result['token'] = token.token;
      //   return result;
      // }
    }

    return result;
  }

  @Get('userinfo')
  userinfo(@CurrentUser() user: any) {
    return user;
  }
}
