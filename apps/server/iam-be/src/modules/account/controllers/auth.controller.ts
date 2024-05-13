import { Request } from 'express';
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
import {
  ChangeEmailRequestDto,
  CreateAccountDto,
  ResendOtpDto,
  UpdateAccountDto,
  UpdateAccountProfileDto,
  VerifyAccountDto,
} from '../dto/account.dto';
import {
  AcceptAccountDto,
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  LoginResponseDto,
  ResetAccountPasswordDto,
  ResetPasswordDto,
} from '../dto/login.dto';
import {
  AllowAnonymous,
  ApiKeyGuard,
  CurrentUser,
  JwtGuard,
  PermissionsGuard,
} from '@auth';
import JwtRefreshGuard from 'src/shared/authorization/guards/jwt-refresh.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CheckSecurityQuestionDto,
  SetSecurityQuestionDto,
} from '../dto/security-question.dto';
import { EmailService } from 'src/shared/email/email.service';
import axios from 'axios';
import { IgnoreTenantInterceptor } from '@decorators';
import { Recaptcha } from '@nestlab/google-recaptcha';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly emailService: EmailService,
  ) {}

  @Recaptcha()
  @Post('signup')
  @AllowAnonymous()
  createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.createAccount(createAccountDto);
  }

  @Recaptcha()
  @Post('login')
  @HttpCode(200)
  @AllowAnonymous()
  @IgnoreTenantInterceptor()
  @ApiResponse({ type: LoginResponseDto, isArray: false, status: 200 })
  login(@Body() loginDto: LoginDto) {
    return this.accountsService.login(loginDto);
  }

  @Post('verify')
  @AllowAnonymous()
  verifyAccount(@Body() verifyAccountDto: VerifyAccountDto) {
    return this.accountsService.verifyAccount(verifyAccountDto);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getUserInfo(@CurrentUser() user: any): Promise<any> {
    return await this.accountsService.getUserDetail(user.id);
  }

  @Post('forget-password')
  @AllowAnonymous()
  forgetPassword(@Body() forgetPassword: ForgetPasswordDto) {
    return this.accountsService.forgetPassword(forgetPassword.email);
  }

  @Post('verify-forget-password')
  @AllowAnonymous()
  verifyForgetPassword(@Body() verifyAccountDto: VerifyAccountDto) {
    return this.accountsService.verifyForgetPassword(verifyAccountDto);
  }

  @Post('reset-password')
  @AllowAnonymous()
  resetPassword(@Body() resetPassword: ResetPasswordDto) {
    return this.accountsService.resetPassword(resetPassword);
  }

  @Post('set-password')
  @AllowAnonymous()
  setPassword(@Body() resetPassword: ResetPasswordDto) {
    return this.accountsService.setPassword(resetPassword);
  }

  @Post('accept-invitation')
  @AllowAnonymous()
  acceptInvitation(@Body() resetPassword: AcceptAccountDto) {
    return this.accountsService.acceptInvitation(resetPassword);
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

  @Post('reset-account-password')
  @UseGuards(JwtGuard, PermissionsGuard('iam:user'))
  resetAccountPassword(
    @Body() changePassword: ResetAccountPasswordDto,
    @CurrentUser() user: any,
  ) {
    return this.accountsService.resetAccountPassword(changePassword, user);
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
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.accountsService.setSecurityQuestions(user.id, payload);
  }

  @Post('reset-password-with-security-questions')
  @AllowAnonymous()
  async checkSecurityQuestions(
    @Body() payload: CheckSecurityQuestionDto,
  ): Promise<any> {
    return await this.accountsService.requestResetPasswordWithUsername(payload);
  }

  @Post('resend-otp')
  @AllowAnonymous()
  async resendInvitation(@Body() payload: ResendOtpDto): Promise<any> {
    return await this.accountsService.resendOtp(payload);
  }

  @Patch('update-account/:id')
  @AllowAnonymous()
  async updateAccount(
    @Param('id') id: string,
    @Body() payload: UpdateAccountDto,
  ): Promise<any> {
    return await this.accountsService.updateAccount(id, payload);
  }

  @Post('update-account-profile')
  async updateAccountProfile(
    @Body() payload: UpdateAccountProfileDto,
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.accountsService.updateAccountProfile(payload, user.id);
  }

  @Get('account-profile')
  async getAccountProfile(@CurrentUser() user: any): Promise<any> {
    return await this.accountsService.getAccountProfile(user.id);
  }

  @Post('change-email-request')
  async changeEmailRequest(
    @Body() payload: ChangeEmailRequestDto,
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.accountsService.changeEmailRequest(payload, user.id);
  }

  @Post('confirm-old-email')
  @AllowAnonymous()
  async confirmOldEmail(@Body() payload: AcceptAccountDto): Promise<any> {
    return await this.accountsService.confirmOldEmail(payload);
  }

  @Post('confirm-new-email')
  @AllowAnonymous()
  async confirmNewEmail(@Body() payload: AcceptAccountDto): Promise<any> {
    return await this.accountsService.confirmNewEmail(payload);
  }

  @Post('request-confirm-phone')
  async requestConfirmPhone(@CurrentUser() user: any): Promise<any> {
    return await this.accountsService.requestConfirmPhone(user.id);
  }

  @Post('confirm-phone')
  @AllowAnonymous()
  async confirmPhone(@Body() payload: AcceptAccountDto): Promise<any> {
    return await this.accountsService.confirmPhone(payload);
  }

  @Get('send-email/:email')
  @AllowAnonymous()
  async sendEmail(@Param('email') email: string): Promise<any> {
    return await this.emailService.sendEmail(email, 'test', 'test');
  }

  @Get('test-permission')
  @UseGuards(JwtGuard, PermissionsGuard('iam:organization|iam:role'))
  async testPermission(@CurrentUser() user: any) {
    return user;
  }

  @Get('test')
  @UseGuards(ApiKeyGuard)
  async testApiKey() {
    return true;
  }

  @Get('req-test')
  @AllowAnonymous()
  async requestApiKey() {
    const request = await axios.get('http://localhost:3569/api/auth/test', {
      headers: {
        'X-API-KEY': '25bc1622e5fb42cca3d3e62e90a3a20f',
      },
    });

    const result = await request.data;

    return result;
  }

  @Post('test-hook')
  @AllowAnonymous()
  testHook(@Body() verifyAccountDto: any) {
    return verifyAccountDto;
  }
}
