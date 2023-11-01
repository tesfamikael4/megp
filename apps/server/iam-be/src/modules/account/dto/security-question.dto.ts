import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { SecurityQuestion } from '@entities';

export class CheckSecurityQuestionDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty({ isArray: true, type: () => Questions })
  @IsArray()
  questions: Questions[];
}

export class SetSecurityQuestionDto {
  @ApiProperty()
  @IsString()
  password: string;

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
  accountId: string;

  static fromDto(
    securityQuestionDto: CreateSecurityQuestionDto,
  ): SecurityQuestion {
    const securityQuestion: SecurityQuestion = new SecurityQuestion();

    securityQuestion.question = securityQuestionDto.question;

    securityQuestion.answer = securityQuestionDto.answer;

    securityQuestion.accountId = securityQuestionDto.accountId;

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

    securityQuestion.accountId = securityQuestionDto.accountId;

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

    securityQuestionDto.accountId = securityQuestion.accountId;

    return securityQuestionDto;
  }

  static toDtos(securityQuestions: SecurityQuestion[]) {
    return securityQuestions?.map((securityQuestion) =>
      SecurityQuestionResponseDto.toDto(securityQuestion),
    );
  }
}
