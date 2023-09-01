import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsDateString, IsArray, IsObject, IsOptional } from 'class-validator';
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
  accountInformationId: string;
     
  static fromDto(securityQuestionDto: CreateSecurityQuestionDto): SecurityQuestion {
    const securityQuestion: SecurityQuestion = new SecurityQuestion();  
    if (!securityQuestionDto) {
      return;
    }
    securityQuestion.question = securityQuestionDto.question;
      
    securityQuestion.answer = securityQuestionDto.answer;
      
    securityQuestion.accountInformationId = securityQuestionDto.accountInformationId;
      
    return securityQuestion;
  }

  static fromDtos(securityQuestionDto: CreateSecurityQuestionDto[]) {
    return securityQuestionDto?.map(securityQuestion => CreateSecurityQuestionDto.fromDto(securityQuestion));
  }
}


export class UpdateSecurityQuestionDto extends CreateSecurityQuestionDto {
  @ApiProperty()
  @IsString()
  id: string;

  static fromDto(securityQuestionDto: UpdateSecurityQuestionDto): SecurityQuestion {
    const securityQuestion: SecurityQuestion = new SecurityQuestion();  
    if (!securityQuestionDto) {
      return;
    }
    securityQuestion.id = securityQuestionDto.id;
      
    securityQuestion.question = securityQuestionDto.question;
      
    securityQuestion.answer = securityQuestionDto.answer;
      
    securityQuestion.accountInformationId = securityQuestionDto.accountInformationId;
      
    return securityQuestion;
  }
}

export class SecurityQuestionResponseDto extends UpdateSecurityQuestionDto {

  static toDto(securityQuestion:SecurityQuestion): SecurityQuestionResponseDto {
    const securityQuestionDto: SecurityQuestionResponseDto = new SecurityQuestionResponseDto();  
 
    securityQuestionDto.id = securityQuestion.id; 
 
    securityQuestionDto.question = securityQuestion.question; 
 
    securityQuestionDto.answer = securityQuestion.answer; 
 
    securityQuestionDto.accountInformationId = securityQuestion.accountInformationId; 
    
    return securityQuestionDto;
  }

  static toDtos(securityQuestions:SecurityQuestion[]) {
    return securityQuestions?.map(securityQuestion => SecurityQuestionResponseDto.toDto(securityQuestion));
  }
}