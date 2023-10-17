import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, AccountVerification, SecurityQuestion } from '@entities';
import { CreateAccountDto, VerifyAccountDto } from '../dto/account.dto';
import {
  AccountStatusEnum,
  AccountVerificationStatusEnum,
} from 'src/shared/enums';
import { AuthHelper } from '../helper/auth.helper';
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
    try {
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

      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  public async verifyAccount(
    body: VerifyAccountDto,
  ): Promise<LoginResponseDto | never> {
    try {
      const { verificationId, otp, isOtp }: VerifyAccountDto = body;
      const account = await this.verifyOTP(verificationId, otp, isOtp);

      account.status = AccountStatusEnum.ACTIVE;
      await this.repository.update(account.id, account);

      const token: LoginResponseDto = {
        access_token: this.helper.generateAccessToken(account),
        refresh_token: this.helper.generateRefreshToken(account),
      };

      return token;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
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
  ): Promise<boolean | never> {
    try {
      const { verificationId, otp, isOtp }: VerifyAccountDto = body;
      await this.verifyOTP(verificationId, otp, isOtp);

      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
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

  public async changePassword(changePassword: ChangePasswordDto) {
    const account = await this.repository.findOneBy({
      id: changePassword.accountId,
    });
    if (!account) {
      throw new HttpException('something_went_wrong', HttpStatus.BAD_REQUEST);
    }
    const isOldPasswordValid: boolean = this.helper.isPasswordValid(
      changePassword.oldPassword,
      account.password,
    );
    if (!isOldPasswordValid) {
      throw new HttpException('incorrect_old_password', HttpStatus.BAD_REQUEST);
    }

    const isNewPasswordValid: boolean = this.helper.isPasswordValid(
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
    try {
      let { username }: LoginDto = body;
      username = username.toLocaleLowerCase();

      const password = body.password;

      const account: Account = await this.repository.findOne({
        where: [{ username }, { email: username }, { phone: username }],
      });

      if (!account || account.status != AccountStatusEnum.ACTIVE) {
        throw new HttpException('something_went_wrong', HttpStatus.BAD_REQUEST);
      }

      const isPasswordValid: boolean = this.helper.isPasswordValid(
        password,
        account.password,
      );

      if (!isPasswordValid) {
        throw new HttpException('something_went_wrong', HttpStatus.BAD_REQUEST);
      }

      this.repository.update(account.id, account);

      const token: LoginResponseDto = {
        access_token: this.helper.generateAccessToken(account),
        refresh_token: this.helper.generateRefreshToken(account),
      };

      return token;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  public async refreshToken(req: any): Promise<LoginResponseDto | never> {
    try {
      const user = req.user;
      if (!user) {
        throw new HttpException(
          'invalid_refresh_token',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const account: Account = await this.repository.findOneBy({
        id: user['id'],
      });

      if (!account) {
        //|| account.status != "active"
        throw new HttpException('something_went_wrong', HttpStatus.BAD_REQUEST);
      }

      this.repository.update(account.id, account);

      const token: LoginResponseDto = {
        access_token: this.helper.generateAccessToken(account),
      };

      return token;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
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
    account.password = this.helper.encodePassword(password);
    account.status = status;

    await this.repository.save(account);
    return account;
  }

  private async createAndSendVerificationOTP(account: Account) {
    try {
      const { accountVerification, otp } = await this.createOTP(account);

      let body: string;
      if (process.env.VERIFICATION_METHOD == 'link') {
        body = `Link: ${accountVerification.otp}`;
      } else {
        body = `OPT: ${otp}`;
      }

      await this.emailService.sendEmail(
        account.email,
        'Email Verification',
        body,
      );

      return accountVerification.id;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  private async createAndSendForgetOTP(account: Account) {
    try {
      const { accountVerification, otp } = await this.createOTP(account);

      let body: string;
      if (process.env.VERIFICATION_METHOD == 'link') {
        body = `Link: ${accountVerification.otp}`;
      } else {
        body = `OPT: ${otp}`;
      }

      await this.emailService.sendEmail(account.email, 'Reset Password', body);

      return accountVerification.id;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  private async createOTP(account: Account) {
    const verificationExists =
      await this.accountVerificationRepository.findOneBy({
        account: { id: account.id },
        status: AccountVerificationStatusEnum.NEW,
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
    await this.accountVerificationRepository.save(accountVerification);
    return { accountVerification, otp };
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

    const isOldPasswordValid: boolean = this.helper.isPasswordValid(
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

    await this.securityQuestionRepository.save(securityQuestions);
  }

  async checkSecurityQuestions(payload: CheckSecurityQuestionDto) {
    if (payload.questions.length != 3) {
      throw new HttpException(
        'invalid_security_question_length',
        HttpStatus.BAD_REQUEST,
      );
    }

    const account = await this.repository.findOne({
      where: [
        {
          username: payload.username,
        },
        {
          email: payload.username,
        },
        {
          phone: payload.username,
        },
      ],
    });

    if (!account) {
      throw new HttpException('account_not_found', HttpStatus.BAD_REQUEST);
    }

    const securityQuestions = await this.securityQuestionRepository.find({
      where: { accountId: account.id },
    });

    for (const question of payload.questions) {
      const answered = securityQuestions.find(
        (q) => q.question == question.question,
      );
      if (!answered) {
        return {
          status: false,
        };
      } else if (answered.answer != question.answer) {
        return {
          status: false,
        };
      }
    }

    return {
      status: true,
      accountId: account.id,
    };
  }

  private async verifyOTP(verificationId: string, otp: string, isOtp: boolean) {
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
      !this.helper.isPasswordValid(accountVerification.otp, otp)
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
      accountVerification.createdAt.getMinutes() + 10 <
      new Date().getMinutes()
    ) {
      accountVerification.status = AccountVerificationStatusEnum.EXPIRED;
      await this.accountVerificationRepository.update(
        accountVerification.id,
        accountVerification,
      );
      throw new HttpException(
        'verification_token_expired',
        HttpStatus.BAD_REQUEST,
      );
    }

    accountVerification.status = AccountVerificationStatusEnum.USED;
    await this.accountVerificationRepository.update(
      accountVerification.id,
      accountVerification,
    );

    const account = await this.repository.findOneBy({
      id: accountVerification.accountId,
    });
    if (!account) {
      throw new HttpException('account_not_found', HttpStatus.NOT_FOUND);
    }

    return account;
  }

  private generateUsername() {
    const result = `me-${Math.floor(Date.now() / 1000)}-${Math.floor(
      Math.random() * 1000000000,
    ).toString()}`;
    return result;
  }
}
