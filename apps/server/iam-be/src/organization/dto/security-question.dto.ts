import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { SecurityQuestion } from '../entities/security-question.entity';

export class CreateSecurityQuestionDto {
  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty()
  @IsString()
  answer: string;

  @ApiProperty()
  @IsString()
  employeeId: string;

  static fromDto(
    securityQuestionDto: CreateSecurityQuestionDto,
  ): SecurityQuestion {
    const securityQuestion: SecurityQuestion = new SecurityQuestion();

    securityQuestion.question = securityQuestionDto.question;

    securityQuestion.answer = securityQuestionDto.answer;

    securityQuestion.employeeId = securityQuestionDto.employeeId;

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

    securityQuestion.employeeId = securityQuestionDto.employeeId;

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

    securityQuestionDto.employeeId = securityQuestion.employeeId;

    return securityQuestionDto;
  }

  static toDtos(securityQuestions: SecurityQuestion[]) {
    return securityQuestions?.map((securityQuestion) =>
      SecurityQuestionResponseDto.toDto(securityQuestion),
    );
  }
}
