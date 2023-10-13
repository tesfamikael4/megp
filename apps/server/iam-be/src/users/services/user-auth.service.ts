import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { SecurityQuestion } from '../entities/security-question.entity';
import {
  CheckSecurityQuestionDto,
  SetSecurityQuestionDto,
} from '../dto/security-question.dto';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SecurityQuestion)
    private readonly securityQuestionRepository: Repository<SecurityQuestion>,
  ) {}

  async registerUser(superTokenUser: any, formFields: any) {
    try {
      const [username, _, firstName, lastName, primaryEmail, primaryPhone] =
        formFields;

      const user = new User();
      user.superTokenUserId = superTokenUser.id;
      user.username = username.value;
      user.firstName = firstName.value;
      user.lastName = lastName.value;
      user.email = primaryEmail.value;
      user.phone = primaryPhone.value;

      await this.userRepository.insert(user);
    } catch (error: any) {
      console.log(
        '🚀 ~ file: organization.service.ts:64 ~ OrganizationService ~ registerOrganization ~ error:',
        error,
      );
    }
  }

  async canUserBeCreated(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async changeUserStatus(superTokenUserId: string) {
    const user = await this.userRepository.findOne({
      where: { superTokenUserId },
    });

    if (user) {
      user.status = 'Accepted';
      await this.userRepository.update(
        { superTokenUserId },
        { status: 'Accepted' },
      );
    }

    return user;
  }

  async getUserInfo(superTokenUserId: string) {
    return await this.userRepository.findOne({
      where: { superTokenUserId },
    });
  }

  async isSecurityQuestionSet(superTokenUserId: string) {
    const securityQuestion = await this.securityQuestionRepository.exist({
      where: {
        user: {
          superTokenUserId,
        },
      },
    });

    return securityQuestion;
  }

  async setSecurityQuestions(
    supertokensUserId: string,
    payload: SetSecurityQuestionDto,
  ) {
    if (payload.questions.length != 3) {
      throw new HttpException(
        'invalid_security_question_length',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepository.findOneBy({
      superTokenUserId: supertokensUserId,
    });
    if (!user) {
      throw new HttpException('user_not_found', HttpStatus.BAD_REQUEST);
    }

    await this.securityQuestionRepository.delete({ userId: user.id });

    const securityQuestions = this.securityQuestionRepository.create(
      payload.questions,
    );

    securityQuestions.forEach((s) => (s.userId = user.id));

    await this.securityQuestionRepository.save(securityQuestions);
  }

  async checkSecurityQuestions(payload: CheckSecurityQuestionDto) {
    if (payload.questions.length != 3) {
      throw new HttpException(
        'invalid_security_question_length',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepository.findOne({
      where: [
        {
          username: payload.username,
        },
        {
          email: payload.username,
        },
      ],
    });

    if (!user) {
      throw new HttpException('user_not_found', HttpStatus.BAD_REQUEST);
    }

    const securityQuestions = await this.securityQuestionRepository.find({
      where: { userId: user.id },
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
      superTokenUserId: user.superTokenUserId,
    };
  }

  async getSecurityQuestions(supertokensUserId: string) {
    const securityQuestion = await this.securityQuestionRepository.find({
      where: {
        user: {
          superTokenUserId: supertokensUserId,
        },
      },
    });

    return securityQuestion;
  }

  generateUsername() {
    const result = `me-${Math.floor(Date.now() / 1000)}-${Math.floor(
      Math.random() * 1000000000,
    ).toString()}`;
    return result;
  }
}
