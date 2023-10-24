import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { SecurityQuestion } from '../entities/security-question.entity';

export class CheckSecurityQuestionDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty({ isArray: true, type: () => Questions })
  @IsArray()
  questions: Questions[];
}

export class SetSecurityQuestionDto {
  @ApiProperty({ isArray: true, type: () => Questions })
  @IsArray()
  questions: Questions[];
}
export class Questions {
  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty()
  @IsString()
  answer: string;
}

export class CreateSecurityQuestionDto {
  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty()
  @IsString()
  answer: string;

  @ApiProperty()
  @IsString()
  userId: string;

  static fromDto(
    securityQuestionDto: CreateSecurityQuestionDto,
  ): SecurityQuestion {
    const securityQuestion: SecurityQuestion = new SecurityQuestion();

    securityQuestion.question = securityQuestionDto.question;

    securityQuestion.answer = securityQuestionDto.answer;

    securityQuestion.userId = securityQuestionDto.userId;

    return securityQuestion;
  }

  static fromDtos(securityQuestionDto: CreateSecurityQuestionDto[]) {
    return securityQuestionDto?.map((securityQuestion) =>
      CreateSecurityQuestionDto.fromDto(securityQuestion),
    );
  }
}

export class UpdateSecurityQuestionDto extends CreateSecurityQuestionDto {
  @ApiProperty()
  @IsString()
  id: string;

  static fromDto(
    securityQuestionDto: UpdateSecurityQuestionDto,
  ): SecurityQuestion {
    const securityQuestion: SecurityQuestion = new SecurityQuestion();

    securityQuestion.id = securityQuestionDto.id;

    securityQuestion.question = securityQuestionDto.question;

    securityQuestion.answer = securityQuestionDto.answer;

    securityQuestion.userId = securityQuestionDto.userId;

    return securityQuestion;
  }
}

export class SecurityQuestionResponseDto extends UpdateSecurityQuestionDto {
  static toDto(
    securityQuestion: SecurityQuestion,
  ): SecurityQuestionResponseDto {
    const securityQuestionDto: SecurityQuestionResponseDto =
      new SecurityQuestionResponseDto();

    securityQuestionDto.id = securityQuestion.id;

    securityQuestionDto.question = securityQuestion.question;

    securityQuestionDto.answer = securityQuestion.answer;

    securityQuestionDto.userId = securityQuestion.userId;

    return securityQuestionDto;
  }

  static toDtos(securityQuestions: SecurityQuestion[]) {
    return securityQuestions?.map((securityQuestion) =>
      SecurityQuestionResponseDto.toDto(securityQuestion),
    );
  }
}
