import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  Account,
  AccountVerification,
  SecurityQuestion,
  User,
  AccountProfile,
} from '@entities';
import {
  ChangeEmailRequestDto,
  CreateAccountDto,
  ResendOtpDto,
  UpdateAccountDto,
  UpdateAccountProfileDto,
  VerifyAccountDto,
} from '../dto/account.dto';
import {
  AccountStatusEnum,
  AccountVerificationStatusEnum,
  AccountVerificationTypeEnum,
  OrganizationStatus,
  UserStatus,
} from '@enums';
import { AuthHelper } from '@auth';
import {
  AcceptAccountDto,
  ChangePasswordDto,
  LoginDto,
  LoginResponseDto,
  ResetAccountPasswordDto,
  ResetPasswordDto,
} from '../dto/login.dto';
import {
  CheckSecurityQuestionDto,
  SetSecurityQuestionDto,
} from '../dto/security-question.dto';
import { EmailService } from 'src/shared/email/email.service';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { EmailChangeRequest } from 'src/entities/email-change-request.entity';

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
    @Inject(REQUEST) private readonly request: Request,
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

    const tokenPayload = await this.getAccessTokenPayload(account.id);

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

    const accountVerification = await this.verifyOTPBackOffice(
      verificationId,
      otp,
      isOtp,
    );

    const entityManager = this.request[ENTITY_MANAGER_KEY];

    await entityManager
      .getRepository(Account)
      .update(accountVerification.accountId, {
        password: this.helper.encodePassword(password),
        status: AccountStatusEnum.ACTIVE,
      });

    await entityManager.getRepository(User).update(accountVerification.userId, {
      status: AccountStatusEnum.ACTIVE,
    });

    return accountVerification;
  }

  public async acceptInvitation(resetPassword: AcceptAccountDto) {
    const { verificationId, otp, isOtp }: AcceptAccountDto = resetPassword;

    const accountVerification = await this.verifyOTPBackOffice(
      verificationId,
      otp,
      isOtp,
    );

    const entityManager = this.request[ENTITY_MANAGER_KEY];

    await entityManager
      .getRepository(Account)
      .update(accountVerification.accountId, {
        status: AccountStatusEnum.ACTIVE,
      });

    await entityManager.getRepository(User).update(accountVerification.userId, {
      status: AccountStatusEnum.ACTIVE,
    });

    return accountVerification;
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

  public async resetAccountPassword(
    changePassword: ResetAccountPasswordDto,
    user: any,
  ) {
    if (!user.organization?.id) {
      throw new HttpException('something_went_wrong', HttpStatus.BAD_REQUEST);
    }

    const entityManager = this.request[ENTITY_MANAGER_KEY];

    const isSameOrganization = await entityManager.getRepository(User).findOne({
      where: {
        accountId: changePassword.accountId,
        organizationId: user.organization.id,
      },
    });
    if (!isSameOrganization) {
      throw new HttpException('something_went_wrong', HttpStatus.BAD_REQUEST);
    }

    const account = await this.repository.findOneBy({
      id: changePassword.accountId,
    });

    if (!account) {
      throw new HttpException('something_went_wrong', HttpStatus.BAD_REQUEST);
    }

    account.password = this.helper.encodePassword(changePassword.password);

    await this.repository.update(account.id, account);

    return account;
  }

  public async login(body: LoginDto): Promise<LoginResponseDto | never> {
    let { username }: LoginDto = body;

    if (!username) {
      throw new HttpException('something_went_wrong', HttpStatus.BAD_REQUEST);
    }

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

    const tokenPayload = await this.getAccessTokenPayload(account.id);

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

    const tokenPayload = await this.getAccessTokenPayload(account.id);

    const token: LoginResponseDto = {
      access_token: this.helper.generateAccessToken(tokenPayload),
    };

    return token;
  }

  async getUserInfo(id: string) {
    const newAccount = await this.repository
      .createQueryBuilder('accounts')
      .leftJoinAndSelect('accounts.users', 'users', `users.status =:status`, {
        status: UserStatus.ACTIVE,
      })
      .leftJoinAndSelect(
        'users.organization',
        'organization',
        `organization.status =:orgStatus`,
        {
          orgStatus: OrganizationStatus.ACTIVE,
        },
      )
      .leftJoin(
        'organization.organizationMandates',
        'organizationMandates',
        'organizationMandates.organizationId = users.organizationId',
      )
      .leftJoin('organizationMandates.mandate', 'mandate')
      .leftJoin('mandate.mandatePermissions', 'mandatePermissions')
      .leftJoinAndSelect('users.userRoles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'role')
      .leftJoinAndSelect(
        'role.rolePermissions',
        'rolePermissions',
        'mandatePermissions.permissionId = rolePermissions.permissionId',
      )
      .leftJoinAndSelect('rolePermissions.permission', 'permissionRole')
      .leftJoinAndSelect('permissionRole.application', 'applicationRole')
      .leftJoinAndSelect('users.userRoleSystems', 'userRoleSystems')
      .leftJoinAndSelect('userRoleSystems.roleSystem', 'roleSystem')
      .leftJoinAndSelect(
        'roleSystem.roleSystemPermissions',
        'roleSystemPermissions',
        'mandatePermissions.permissionId = roleSystemPermissions.permissionId',
      )
      .leftJoinAndSelect(
        'roleSystemPermissions.permission',
        'permissionRoleSystem',
      )
      .leftJoinAndSelect(
        'permissionRoleSystem.application',
        'applicationRoleSystem',
      )
      .andWhere('accounts.id =:id', { id })
      .getOne();

    return newAccount;
  }

  async getUserInfoPayload(accountId: string) {
    return await this.getAccessTokenPayload(accountId);
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

  async getAccountByEmail(email: string) {
    const account: Account = await this.repository.findOne({
      where: { email },
    });

    if (!account) {
      throw new HttpException('account_does_not_exists', HttpStatus.NOT_FOUND);
    }

    return account;
  }

  async createBackOfficeAccount(input: any) {
    if (!input.email) {
      return await this.createNewAccount(input, AccountStatusEnum.PENDING);
    }

    let account: Account = await this.repository.findOne({
      where: {
        email: input.email,
      },
    });

    if (!account) {
      account = await this.createNewAccount(input, AccountStatusEnum.PENDING);
    }

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

  async inviteBackOfficeAccount(accountId: string, userId: string) {
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
        userId,
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

    const verification = await this.createAndSendInvitationVerificationOTP(
      account,
      userId,
    );

    const entityManager = this.request[ENTITY_MANAGER_KEY];

    await entityManager.getRepository(Account).update(account.id, {
      status: AccountStatusEnum.INVITED,
    });

    await entityManager.getRepository(User).update(userId, {
      status: UserStatus.INVITED,
    });

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

  async updateAccount(id: string, payload: UpdateAccountDto) {
    const account = await this.repository.findOneBy({ id });
    if (!account) {
      throw new HttpException('account_not_found', HttpStatus.NOT_FOUND);
    }

    await this.repository.update(id, {
      firstName: payload.firstName,
      lastName: payload.lastName,
    });

    return {
      id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: account.email,
    };
  }

  async updateAccountProfile(
    payload: UpdateAccountProfileDto,
    accountId: string,
  ) {
    const account = await this.repository.findOneBy({ id: accountId });
    if (!account) {
      throw new HttpException('account_not_found', HttpStatus.NOT_FOUND);
    }
    const entityManager = this.request[ENTITY_MANAGER_KEY];
    const parsedPayload = {
      accountId,
      extendedProfile: payload.extendedProfile,
    };
    await entityManager
      .getRepository(AccountProfile)
      .upsert(parsedPayload, ['accountId']);
    return parsedPayload;
  }

  async getAccountProfile(accountId: string) {
    const entityManager = this.request[ENTITY_MANAGER_KEY];

    return await entityManager
      .getRepository(AccountProfile)
      .findOneBy({ accountId });
  }

  async changeEmailRequest(payload: ChangeEmailRequestDto, accountId: string) {
    const account = await this.repository.findOneBy({ id: accountId });
    if (!account) {
      throw new BadRequestException('account_not_found');
    } else if (!account.email) {
      throw new BadRequestException('account_email_not_found');
    }

    const emailExists = await this.repository.existsBy({
      email: payload.newEmail,
    });
    if (emailExists) {
      throw new BadRequestException('account_email_exists');
    }

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const emailChangeRequest = manager
      .getRepository(EmailChangeRequest)
      .create({
        accountId,
        newEmail: payload.newEmail,
        oldEmail: account.email,
      });

    await manager.getRepository(EmailChangeRequest).insert(emailChangeRequest);

    const { accountVerification, otp } = await this.createOTP(
      account,
      AccountVerificationTypeEnum.CONFIRM_OLD_EMAIL,
      emailChangeRequest.id,
    );

    // const fullName = `${account.firstName} ${account.lastName}`;

    // const OTP_LIFE_TIME = Number(process.env.OTP_LIFE_TIME ?? 60);

    // const body = this.helper.verifyEmailTemplateForOtp(
    //   fullName,
    //   account.username,
    //   otp,
    //   OTP_LIFE_TIME,
    // );

    const body = 'OTP: ' + otp;

    await this.emailService.sendEmail(account.email, 'Change Email OTP', body);

    //TODO: send sms

    return { verificationId: accountVerification.id };
  }

  async confirmOldEmail(payload: AcceptAccountDto) {
    const { verificationId, otp, isOtp }: AcceptAccountDto = payload;
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const accountVerification = await this.verifyOTPBackOffice(
      verificationId,
      otp,
      isOtp,
    );
    if (!accountVerification?.userId) {
      throw new BadRequestException('verification_token_not_found');
    }

    const emailChangeRequest = await manager
      .getRepository(EmailChangeRequest)
      .findOne({
        where: {
          id: accountVerification.userId,
        },
        relations: {
          account: true,
        },
      });

    await manager.getRepository(EmailChangeRequest).update(
      {
        id: emailChangeRequest.id,
      },
      { status: 'OLD_EMAIL_CONFIRMED' },
    );

    const newOtp = await this.createOTP(
      emailChangeRequest.account,
      AccountVerificationTypeEnum.CONFIRM_NEW_EMAIL,
      emailChangeRequest.id,
    );

    // const fullName = `${emailChangeRequest.account.firstName} ${emailChangeRequest.account.lastName}`;

    // const OTP_LIFE_TIME = Number(process.env.OTP_LIFE_TIME ?? 60);

    const body = 'OTP: ' + newOtp.otp;

    await this.emailService.sendEmail(
      emailChangeRequest.newEmail,
      'Confirm New Email OTP',
      body,
    );

    return {
      verificationId: newOtp.accountVerification.id,
    };
  }

  async confirmNewEmail(payload: AcceptAccountDto) {
    const { verificationId, otp, isOtp }: AcceptAccountDto = payload;
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const accountVerification = await this.verifyOTPBackOffice(
      verificationId,
      otp,
      isOtp,
    );
    if (!accountVerification?.userId) {
      throw new BadRequestException('verification_token_not_found');
    }

    const emailChangeRequest = await manager
      .getRepository(EmailChangeRequest)
      .findOne({
        where: {
          id: accountVerification.userId,
        },
      });

    await manager.getRepository(EmailChangeRequest).update(
      {
        id: emailChangeRequest.id,
      },
      { status: 'EMAIL_CHANGED' },
    );
    await manager.getRepository(Account).update(emailChangeRequest.accountId, {
      email: emailChangeRequest.newEmail,
    });
  }

  async getUserDetail(accountId: string) {
    const userInfo = await this.getUserInfo(accountId);

    const organizations = [];

    const users = userInfo?.users?.filter((x) => x.organization != null);

    for (const user of users) {
      const permissions = [];
      const roles = [];
      const roleSystems = [];
      const applications = [];
      user?.userRoles?.forEach((userRole) => {
        const role = {
          id: userRole.role.id,
          name: userRole.role.name,
        };

        roles.push(role);

        userRole?.role?.rolePermissions?.forEach((rolePermission) => {
          if (rolePermission?.permission) {
            permissions.push({
              id: rolePermission.permission.id,
              name: rolePermission.permission.name,
              key: rolePermission.permission.key,
              applicationId: rolePermission.permission.applicationId,
            });

            if (
              !applications.find(
                (x) => x.id === rolePermission.permission.applicationId,
              )
            ) {
              applications.push({
                id: rolePermission.permission.application.id,
                key: rolePermission.permission.application.key,
                name: rolePermission.permission.application.name,
              });
            }
          }
        });
      });

      user?.userRoleSystems?.forEach((userRole) => {
        const roleSystem = {
          id: userRole.roleSystem.id,
          key: userRole.roleSystem.key,
          name: userRole.roleSystem.name,
        };

        roleSystems.push(roleSystem);

        userRole?.roleSystem?.roleSystemPermissions?.forEach(
          (rolePermission) => {
            if (rolePermission?.permission) {
              permissions.push({
                id: rolePermission.permission.id,
                name: rolePermission.permission.name,
                key: rolePermission.permission.key,
                applicationId: rolePermission.permission.applicationId,
              });

              if (
                !applications.find(
                  (x) => x.id === rolePermission.permission.applicationId,
                )
              ) {
                applications.push({
                  id: rolePermission.permission.application.id,
                  key: rolePermission.permission.application.key,
                  name: rolePermission.permission.application.name,
                });
              }
            }
          },
        );
      });

      let organization: any;
      if (user?.organization) {
        const org = user?.organization;
        organization = {
          id: org.id,
          name: org.name,
          shortName: org.shortName,
          code: org.code,
        };
      }

      organizations.push({
        userId: user?.id,
        organization,
        permissions,
        roles,
        roleSystems,
        applications,
      });
    }

    const tokenPayload = {
      tenantId: userInfo.tenantId,
      id: userInfo.id,
      username: userInfo.username,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      organizations,
    };

    return tokenPayload;
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

  private async verifyOTPBackOffice(
    verificationId: string,
    otp: string,
    isOtp: boolean,
    invalidateOtp = true,
  ) {
    const OTP_LIFE_TIME = Number(process.env.OTP_LIFE_TIME ?? 10);

    const entityManager = this.request[ENTITY_MANAGER_KEY];

    const accountVerification =
      await this.accountVerificationRepository.findOne({
        where: {
          id: verificationId,
          status: AccountVerificationStatusEnum.NEW,
        },
        relations: {
          account: true,
        },
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
      await entityManager
        .getRepository(AccountVerification)
        .update(accountVerification.id, {
          status: AccountVerificationStatusEnum.EXPIRED,
        });

      throw new HttpException(
        'verification_token_expired',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (invalidateOtp) {
      await entityManager
        .getRepository(AccountVerification)
        .update(accountVerification.id, {
          status: AccountVerificationStatusEnum.USED,
        });
    }

    return accountVerification;
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

  private async createAndSendInvitationVerificationOTP(
    account: Account,
    userId: string,
  ) {
    const { accountVerification, otp } = await this.createOTP(
      account,
      AccountVerificationTypeEnum.INVITATION,
      userId,
    );

    if (account.email) {
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
    }

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
    userId?: string,
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
    accountVerification.userId = userId;

    await this.accountVerificationRepository.save(accountVerification);
    return { accountVerification, otp };
  }

  private async getAccessTokenPayload(accountId: string) {
    const userInfo = await this.getUserInfo(accountId);

    const organizations = [];

    const users = userInfo?.users?.filter((x) => x.organization != null);

    for (const user of users) {
      const permissions: string[] = [];
      // const roles = [];
      const roleSystems: string[] = [];
      const applications: string[] = [];
      user?.userRoles?.forEach((userRole) => {
        // const role = {
        //   id: userRole.role.id,
        //   name: userRole.role.name,
        // };

        // roles.push(role);

        userRole?.role?.rolePermissions?.forEach((rolePermission) => {
          if (rolePermission?.permission) {
            permissions.push(rolePermission.permission.key);

            if (
              !applications.find(
                (x) => x === rolePermission.permission.application.key,
              )
            ) {
              applications.push(rolePermission.permission.application.key);
            }
          }
        });
      });

      user?.userRoleSystems?.forEach((userRole) => {
        roleSystems.push(userRole.roleSystem.key);

        userRole?.roleSystem?.roleSystemPermissions?.forEach(
          (rolePermission) => {
            if (rolePermission?.permission) {
              permissions.push(rolePermission.permission.key);

              if (
                !applications.find(
                  (x) => x === rolePermission.permission.application.key,
                )
              ) {
                applications.push(rolePermission.permission.application.key);
              }
            }
          },
        );
      });

      let organization: any;
      if (user?.organization) {
        const org = user?.organization;
        organization = {
          id: org.id,
          name: org.name,
          shortName: org.shortName,
          code: org.code,
        };
      }

      organizations.push({
        userId: user?.id,
        organization,
        permissions,
        // roles,
        roleSystems,
        applications,
      });
    }

    const tokenPayload = {
      tenantId: userInfo.tenantId,
      id: userInfo.id,
      username: userInfo.username,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      organizations,
    };

    return tokenPayload;
  }

  private generateUsername() {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    const numbers = '0123456789';
    const numbersLength = numbers.length;
    for (let i = 0; i < 4; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbersLength));
    }

    return 'mu-' + result;
  }

  private getRandomNumber(min = 5, max = 10) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
}
