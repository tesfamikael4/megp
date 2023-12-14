import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, AccountVerification, SecurityQuestion } from '@entities';
import {
  CreateAccountDto,
  ResendOtpDto,
  VerifyAccountDto,
} from '../dto/account.dto';
import {
  AccountStatusEnum,
  AccountVerificationStatusEnum,
  AccountVerificationTypeEnum,
} from '@enums';
import { AuthHelper } from '@auth';
import {
  ChangePasswordDto,
  LoginDto,
  LoginResponseDto,
  ResetPasswordDto,
} from '../dto/login.dto';
import {
  CheckSecurityQuestionDto,
  SetSecurityQuestionDto,
} from '../dto/security-question.dto';
import { EmailService } from 'src/shared/email/email.service';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
    @InjectRepository(AccountVerification)
    private readonly accountVerificationRepository: Repository<AccountVerification>,
    @InjectRepository(SecurityQuestion)
    private readonly securityQuestionRepository: Repository<SecurityQuestion>,
    private readonly helper: AuthHelper,
    private readonly emailService: EmailService,
  ) {}

  public async createAccount(
    createAccountDto: CreateAccountDto,
  ): Promise<any | never> {
    let { email }: CreateAccountDto = createAccountDto;
    email = email.toLocaleLowerCase();

    let account: Account = await this.repository.findOne({
      where: { email },
    });

    if (!account) {
      account = await this.createNewAccount(
        createAccountDto,
        AccountStatusEnum.PENDING,
      );
      const verificationId = await this.createAndSendVerificationOTP(account);
      return { verificationId };
    } else if (account.status == AccountStatusEnum.PENDING) {
      const verificationId = await this.createAndSendVerificationOTP(account);
      return { verificationId };
    }

    throw new BadRequestException('Conflict');
  }

  public async verifyAccount(
    body: VerifyAccountDto,
  ): Promise<LoginResponseDto | never> {
    const { verificationId, otp, isOtp }: VerifyAccountDto = body;
    const account = await this.verifyOTP(verificationId, otp, isOtp);

    account.status = AccountStatusEnum.ACTIVE;
    await this.repository.update(account.id, account);

    const tokenPayload = await this.getAccessTokenPayload(account);

    const token: LoginResponseDto = {
      is_security_question_set: account.securityQuestions?.length != 0,
      access_token: this.helper.generateAccessToken(tokenPayload),
      refresh_token: this.helper.generateRefreshToken({ id: account.id }),
    };

    return token;
  }

  public async forgetPassword(email: string) {
    email = email.toLocaleLowerCase();

    const account: Account = await this.repository.findOneBy({ email });
    if (!account || account.status != AccountStatusEnum.ACTIVE) {
      throw new HttpException('something_went_wrong', HttpStatus.BAD_REQUEST);
    }
    const verificationId = await this.createAndSendForgetOTP(account);

    return { verificationId };
  }

  public async verifyForgetPassword(
    body: VerifyAccountDto,
  ): Promise<any | never> {
    const { verificationId, otp, isOtp }: VerifyAccountDto = body;
    await this.verifyOTP(verificationId, otp, isOtp, false);

    return {
      status: true,
    };
  }

  public async resetPassword(resetPassword: ResetPasswordDto) {
    const { verificationId, otp, password, isOtp }: ResetPasswordDto =
      resetPassword;

    const verifyOTP = await this.verifyOTP(verificationId, otp, isOtp);

    const account = await this.repository.findOneBy({
      id: verifyOTP.id,
    });

    account.password = this.helper.encodePassword(password);

    await this.repository.update(account.id, account);

    return account;
  }

  public async setPassword(resetPassword: ResetPasswordDto) {
    const { verificationId, otp, password, isOtp }: ResetPasswordDto =
      resetPassword;

    const verifyOTP = await this.verifyOTP(verificationId, otp, isOtp);

    const account = await this.repository.findOneBy({
      id: verifyOTP.id,
    });

    if (!account) {
      throw new HttpException('user_not_found', HttpStatus.BAD_REQUEST);
    } else if (account.status != AccountStatusEnum.INVITED) {
      throw new HttpException('user_already_active', HttpStatus.BAD_REQUEST);
    }

    account.password = this.helper.encodePassword(password);
    account.status = AccountStatusEnum.ACTIVE;

    await this.repository.update(account.id, account);

    return account;
  }

  public async changePassword(changePassword: ChangePasswordDto) {
    const account = await this.repository.findOneBy({
      id: changePassword.accountId,
    });
    if (!account) {
      throw new HttpException('something_went_wrong', HttpStatus.BAD_REQUEST);
    }
    const isOldPasswordValid: boolean = this.helper.compareHashedValue(
      changePassword.oldPassword,
      account.password,
    );
    if (!isOldPasswordValid) {
      throw new HttpException('incorrect_old_password', HttpStatus.BAD_REQUEST);
    }

    const isNewPasswordValid: boolean = this.helper.compareHashedValue(
      changePassword.newPassword,
      account.password,
    );
    if (isNewPasswordValid) {
      throw new HttpException(
        'old_password_same_with_new',
        HttpStatus.BAD_REQUEST,
      );
    }

    account.password = this.helper.encodePassword(changePassword.newPassword);

    await this.repository.update(account.id, account);

    return account;
  }

  public async login(body: LoginDto): Promise<LoginResponseDto | never> {
    let { username }: LoginDto = body;
    username = username.toLocaleLowerCase();

    const password = body.password;

    const account: Account = await this.repository.findOne({
      where: [{ username }, { email: username }, { phone: username }],
      relations: ['securityQuestions'],
    });

    if (
      !account ||
      account.status != AccountStatusEnum.ACTIVE ||
      account.bannedUntil > new Date()
    ) {
      throw new HttpException('something_went_wrong', HttpStatus.BAD_REQUEST);
    }

    const isPasswordValid: boolean = this.helper.compareHashedValue(
      password,
      account.password,
    );

    let bannedUntil: any;
    let failedAttempts: number;

    if (!isPasswordValid) {
      const MAXIMUM_FAILED_ATTEMPT = Number(
        process.env.MAXIMUM_FAILED_ATTEMPT ?? 5,
      );

      failedAttempts = account.failedAttempts + 1;

      if (account.failedAttempts >= MAXIMUM_FAILED_ATTEMPT) {
        const minute = this.getRandomNumber();
        const durationOfBan = new Date();

        bannedUntil = new Date(
          durationOfBan.setMinutes(durationOfBan.getMinutes() + minute),
        );

        failedAttempts = 0;
      }

      await this.repository.update(account.id, {
        failedAttempts,
        bannedUntil,
      });

      throw new HttpException('something_went_wrong', HttpStatus.BAD_REQUEST);
    }

    this.repository.update(account.id, { failedAttempts, bannedUntil });

    const tokenPayload = await this.getAccessTokenPayload(account);

    const token: LoginResponseDto = {
      is_security_question_set: account.securityQuestions?.length != 0,
      access_token: this.helper.generateAccessToken(tokenPayload),
      refresh_token: this.helper.generateRefreshToken({ id: account.id }),
    };

    return token;
  }

  public async refreshToken(req: any): Promise<LoginResponseDto | never> {
    const user = req.user;
    if (!user) {
      throw new HttpException('invalid_refresh_token', HttpStatus.UNAUTHORIZED);
    }
    const id = user.id;

    const account: Account = await this.repository.findOneBy({
      id,
    });

    if (!account) {
      throw new HttpException('something_went_wrong', HttpStatus.BAD_REQUEST);
    }

    const tokenPayload = await this.getAccessTokenPayload(account);

    const token: LoginResponseDto = {
      access_token: this.helper.generateAccessToken(tokenPayload),
    };

    return token;
  }

  async getUserInfo(id: string) {
    const account = await this.repository.findOne({
      where: {
        id,
      },
      select: {
        tenantId: true,
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        user: {
          id: true,
          accountId: true,
          organization: {
            id: true,
            name: true,
            shortName: true,
          },
          userRoles: {
            id: true,
            roleId: true,
            role: {
              id: true,
              key: true,
              name: true,
              rolePermissions: {
                id: true,
                permissionId: true,
                permission: {
                  id: true,
                  key: true,
                  applicationId: true,
                  application: {
                    id: true,
                    key: true,
                  },
                },
              },
            },
          },
          userRoleSystems: {
            id: true,
            roleSystemId: true,
            roleSystem: {
              id: true,
              key: true,
              name: true,
              roleSystemPermissions: {
                id: true,
                permissionId: true,
                permission: {
                  id: true,
                  key: true,
                  applicationId: true,
                  application: {
                    id: true,
                    key: true,
                  },
                },
              },
            },
          },
        },
      },
      relations: {
        user: {
          organization: true,
          userRoles: {
            role: {
              rolePermissions: {
                permission: {
                  application: true,
                },
              },
            },
          },
          userRoleSystems: {
            roleSystem: {
              roleSystemPermissions: {
                permission: {
                  application: true,
                },
              },
            },
          },
        },
      },
    });

    return account;
  }

  async getAccessTokenPayload(account: Account) {
    const userInfo = await this.getUserInfo(account.id);

    const permissions = [];
    const roles = [];
    const roleSystems = [];
    userInfo.user?.userRoles?.forEach((userRole) => {
      const role = {
        id: userRole.role.id,
        key: userRole.role.key,
        name: userRole.role.name,
      };

      roles.push(role);

      userRole?.role?.rolePermissions?.forEach((rolePermission) => {
        rolePermission?.permission &&
          permissions.push(rolePermission.permission);
      });
    });

    userInfo.user?.userRoleSystems?.forEach((userRole) => {
      const roleSystem = {
        id: userRole.roleSystem.id,
        key: userRole.roleSystem.key,
        name: userRole.roleSystem.name,
      };

      roleSystems.push(roleSystem);

      userRole?.roleSystem?.roleSystemPermissions?.forEach((rolePermission) => {
        rolePermission?.permission &&
          permissions.push(rolePermission.permission);
      });
    });

    const tokenPayload = {
      tenantId: userInfo.tenantId,
      id: userInfo.id,
      userId: userInfo.user?.id,
      username: account.username,
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      organization: userInfo.user?.organization ?? {},
      permissions,
      roles,
      roleSystems,
    };

    return tokenPayload;
  }

  async isSecurityQuestionSet(accountId: string) {
    const securityQuestion = await this.securityQuestionRepository.exist({
      where: {
        accountId: accountId,
      },
    });

    return securityQuestion;
  }

  async setSecurityQuestions(
    accountId: string,
    payload: SetSecurityQuestionDto,
  ) {
    if (payload.questions.length != 3) {
      throw new HttpException(
        'invalid_security_question_length',
        HttpStatus.BAD_REQUEST,
      );
    }

    const account = await this.repository.findOneBy({
      id: accountId,
    });
    if (!account) {
      throw new HttpException('account_not_found', HttpStatus.BAD_REQUEST);
    }

    const isOldPasswordValid: boolean = this.helper.compareHashedValue(
      payload.password,
      account.password,
    );
    if (!isOldPasswordValid) {
      throw new HttpException('incorrect_password', HttpStatus.BAD_REQUEST);
    }

    await this.securityQuestionRepository.delete({ accountId: account.id });

    const securityQuestions = this.securityQuestionRepository.create(
      payload.questions,
    );

    securityQuestions.forEach((s) => (s.accountId = account.id));

    await this.securityQuestionRepository.insert(securityQuestions);

    return {
      status: true,
    };
  }

  async requestResetPasswordWithUsername(payload: CheckSecurityQuestionDto) {
    if (payload.questions.length != 3) {
      throw new HttpException(
        'invalid_security_question_length',
        HttpStatus.BAD_REQUEST,
      );
    }

    const account = await this.repository.findOne({
      where: {
        username: payload.username,
      },
    });

    if (!account) {
      throw new HttpException('account_not_found', HttpStatus.BAD_REQUEST);
    }

    const securityQuestions = await this.securityQuestionRepository.find({
      where: { accountId: account.id },
    });

    let correctCount = 0;

    for (const question of payload.questions) {
      const answered = securityQuestions.find(
        (q) => q.question == question.question,
      );
      if (!answered || answered.answer != question.answer) {
        continue;
      }
      correctCount++;
    }

    if (correctCount < 2) {
      throw new HttpException(
        'security_questions_not_answered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { accountVerification, otp } = await this.createOTP(
      account,
      AccountVerificationTypeEnum.RESET_PASSWORD,
    );

    return {
      verificationId: accountVerification.id,
      otp,
      isOtp: true,
    };
  }

  async createBackOfficeAccount(input: any) {
    let { email }: CreateAccountDto = input;
    email = email.toLocaleLowerCase();

    let account: Account = await this.repository.findOne({
      where: { email },
    });

    if (account) {
      throw new HttpException('account_exists', HttpStatus.NOT_FOUND);
    }

    account = await this.createNewAccount(input, AccountStatusEnum.PENDING);
    return account;
  }

  async createDefaultOrganizationAccount(input: any) {
    const { code } = input;
    const email = `${code.toLocaleLowerCase()}@megp.com`;

    let account: Account = await this.repository.findOne({
      where: { email },
    });

    if (account) {
      throw new HttpException('account_exists', HttpStatus.NOT_FOUND);
    }

    input.username = code.toLocaleLowerCase();
    input.email = email;
    input.password = process.env.DEFAULT_ORG_ADMIN_PASSWORD ?? '123123';

    account = await this.createDefaultAccount(input, AccountStatusEnum.ACTIVE);
    return account;
  }

  async inviteBackOfficeAccount(accountId: string) {
    const account: Account = await this.repository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new HttpException('account_not_found', HttpStatus.NOT_FOUND);
    }

    const OTP_LIFE_TIME = Number(process.env.OTP_LIFE_TIME ?? 10);

    const invitation = await this.accountVerificationRepository.findOne({
      where: {
        accountId,
        otpType: AccountVerificationTypeEnum.INVITATION,
      },
      relations: {
        account: true,
      },
    });

    if (invitation) {
      if (
        invitation.createdAt.getMinutes() + OTP_LIFE_TIME >
        new Date().getMinutes()
      ) {
        return invitation;
      } else {
        await this.accountVerificationRepository.update(invitation.id, {
          status: AccountVerificationStatusEnum.EXPIRED,
        });
      }
    }

    account.status = AccountStatusEnum.INVITED;

    const verification =
      await this.createAndSendInvitationVerificationOTP(account);

    await this.repository.update(account.id, account);

    return verification;
  }

  async getInvitation(id: string) {
    return await this.accountVerificationRepository.findOne({
      where: {
        account: {
          id,
        },
        otpType: AccountVerificationTypeEnum.INVITATION,
      },
      relations: {
        account: true,
      },
    });
  }

  async resendOtp(payload: ResendOtpDto) {
    const invitation = await this.accountVerificationRepository.findOne({
      where: {
        id: payload.verificationId,
      },
      relations: {
        account: true,
      },
    });
    if (!invitation) {
      throw new HttpException('verification_not_found', HttpStatus.NOT_FOUND);
    }

    const OTP_LIFE_TIME = Number(process.env.OTP_LIFE_TIME ?? 10);

    if (invitation.status == AccountVerificationStatusEnum.USED) {
      throw new HttpException(
        'verification_already_used',
        HttpStatus.NOT_FOUND,
      );
    } else if (
      invitation.createdAt.getMinutes() + OTP_LIFE_TIME >
      new Date().getMinutes()
    ) {
      return;
    }

    await this.accountVerificationRepository.update(invitation.id, {
      status: AccountVerificationStatusEnum.EXPIRED,
    });

    const verificationId = await this.createAndSendVerificationOTP(
      invitation.account,
    );

    return { verificationId };
  }

  private async verifyOTP(
    verificationId: string,
    otp: string,
    isOtp: boolean,
    invalidateOtp = true,
  ) {
    const OTP_LIFE_TIME = Number(process.env.OTP_LIFE_TIME ?? 10);

    const accountVerification =
      await this.accountVerificationRepository.findOneBy({
        id: verificationId,
        status: AccountVerificationStatusEnum.NEW,
      });

    if (!accountVerification) {
      throw new HttpException(
        'verification_token_not_found',
        HttpStatus.NOT_FOUND,
      );
    } else if (
      isOtp &&
      !this.helper.compareHashedValue(otp, accountVerification.otp)
    ) {
      throw new HttpException(
        'invalid_verification_token',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!isOtp && accountVerification.otp != otp) {
      throw new HttpException(
        'invalid_verification_token',
        HttpStatus.BAD_REQUEST,
      );
    } else if (
      accountVerification.createdAt.getMinutes() + OTP_LIFE_TIME <
      new Date().getMinutes()
    ) {
      await this.accountVerificationRepository.update(accountVerification.id, {
        status: AccountVerificationStatusEnum.EXPIRED,
      });

      throw new HttpException(
        'verification_token_expired',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (invalidateOtp) {
      await this.accountVerificationRepository.update(accountVerification.id, {
        status: AccountVerificationStatusEnum.USED,
      });
    }

    const account = await this.repository.findOneBy({
      id: accountVerification.accountId,
    });
    if (!account) {
      throw new HttpException('account_not_found', HttpStatus.NOT_FOUND);
    }

    return account;
  }

  private async createNewAccount(
    accountDto: CreateAccountDto,
    status: AccountStatusEnum,
  ) {
    const { email, password, firstName, lastName, phone } = accountDto;

    const account = new Account();
    account.username = this.generateUsername();
    account.email = email;
    account.firstName = firstName;
    account.lastName = lastName;
    account.phone = phone;
    account.password = password && this.helper.encodePassword(password);
    account.status = status;

    await this.repository.insert(account);
    return account;
  }

  private async createDefaultAccount(
    accountDto: any,
    status: AccountStatusEnum,
  ) {
    const { email, password, username, name } = accountDto;

    const account = new Account();
    account.username = username;
    account.email = email;
    account.firstName = name;
    account.lastName = name;
    account.password = this.helper.encodePassword(password);
    account.status = status;

    await this.repository.insert(account);
    return account;
  }

  private async createAndSendVerificationOTP(account: Account) {
    const { accountVerification, otp } = await this.createOTP(
      account,
      AccountVerificationTypeEnum.EMAIL_VERIFICATION,
    );

    const fullName = `${account.firstName} ${account.lastName}`;
    const OTP_LIFE_TIME = Number(process.env.OTP_LIFE_TIME ?? 10);

    let body: string;

    const VERIFICATION_METHOD = process.env.VERIFICATION_METHOD ?? 'OTP';

    if (VERIFICATION_METHOD == 'OTP') {
      body = this.helper.verifyEmailTemplateForOtp(
        fullName,
        account.username,
        otp,
        OTP_LIFE_TIME,
      );
    } else {
      body = `Link: ${accountVerification.otp}`;
    }

    await this.emailService.sendEmail(
      account.email,
      'Email Verification',
      body,
    );

    return accountVerification.id;
  }

  private async createAndSendInvitationVerificationOTP(account: Account) {
    const { accountVerification, otp } = await this.createOTP(
      account,
      AccountVerificationTypeEnum.INVITATION,
    );

    const fullName = `${account.firstName} ${account.lastName}`;

    const OTP_LIFE_TIME = Number(process.env.OTP_LIFE_TIME ?? 60);

    const body = this.helper.verifyEmailTemplateForOtp(
      fullName,
      account.username,
      otp,
      OTP_LIFE_TIME,
    );

    await this.emailService.sendEmail(
      account.email,
      'Email Verification',
      body,
    );

    return accountVerification;
  }

  private async createAndSendForgetOTP(account: Account) {
    const { accountVerification, otp } = await this.createOTP(
      account,
      AccountVerificationTypeEnum.RESET_PASSWORD,
    );

    const VERIFICATION_METHOD = process.env.VERIFICATION_METHOD ?? 'OTP';

    let body: string;

    if (VERIFICATION_METHOD == 'OTP') {
      body = `OPT: ${otp}`;
    } else {
      body = `Link: ${accountVerification.otp}`;
    }

    await this.emailService.sendEmail(account.email, 'Reset Password', body);

    return accountVerification.id;
  }

  private async createOTP(
    account: Account,
    otpType: AccountVerificationTypeEnum,
  ) {
    const verificationExists =
      await this.accountVerificationRepository.findOneBy({
        account: { id: account.id },
        status: AccountVerificationStatusEnum.NEW,
        otpType,
      });
    if (verificationExists) {
      verificationExists.status = AccountVerificationStatusEnum.EXPIRED;
      await this.accountVerificationRepository.update(
        verificationExists.id,
        verificationExists,
      );
    }

    const otp = this.helper.generateOpt();

    const accountVerification: AccountVerification = new AccountVerification();
    accountVerification.account = account;
    accountVerification.otp = this.helper.encodePassword(otp);
    accountVerification.otpType = otpType;
    await this.accountVerificationRepository.save(accountVerification);
    return { accountVerification, otp };
  }

  private generateUsername() {
    const result = `me-${Math.floor(Date.now() / 1000)}-${Math.floor(
      Math.random() * 1000000000,
    ).toString()}`;
    return result;
  }

  private getRandomNumber(min = 5, max = 10) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
}
