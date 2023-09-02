import { SecurityQuestion } from '../entities/security-question.entity';
export declare class CreateSecurityQuestionDto {
  question: string;
  answer: string;
  employeeId: string;
  static fromDto(
    securityQuestionDto: CreateSecurityQuestionDto,
  ): SecurityQuestion;
  static fromDtos(
    securityQuestionDto: CreateSecurityQuestionDto[],
  ): SecurityQuestion[];
}
export declare class UpdateSecurityQuestionDto extends CreateSecurityQuestionDto {
  id: string;
  static fromDto(
    securityQuestionDto: UpdateSecurityQuestionDto,
  ): SecurityQuestion;
}
export declare class SecurityQuestionResponseDto extends UpdateSecurityQuestionDto {
  static toDto(securityQuestion: SecurityQuestion): SecurityQuestionResponseDto;
  static toDtos(
    securityQuestions: SecurityQuestion[],
  ): SecurityQuestionResponseDto[];
}
