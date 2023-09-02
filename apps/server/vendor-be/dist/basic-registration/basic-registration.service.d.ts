import { Repository } from 'typeorm';
import { CollectionQuery } from '@collection-query';
import { DataResponseFormat } from '@api-data';
import { BasicRegistration } from './entities/basic-registration.entity';
import { SecurityQuestion } from './entities/security-question.entity';
import {
  CreateSecurityQuestionDto,
  UpdateSecurityQuestionDto,
  SecurityQuestionResponseDto,
} from './dto/security-question.dto';
import {
  BasicRegistrationResponseDto,
  CreateBasicRegistrationDto,
  UpdateBasicRegistrationDto,
} from './dto/basic-registration.dto';
export declare class BasicRegistrationService {
  private readonly repository;
  private readonly securityQuestionRepository;
  constructor(
    repository: Repository<BasicRegistration>,
    securityQuestionRepository: Repository<SecurityQuestion>,
  );
  registerVendor(user: any, formFields: any): Promise<void>;
  create(
    accountInformation: CreateBasicRegistrationDto,
  ): Promise<BasicRegistrationResponseDto>;
  findAll(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<BasicRegistrationResponseDto>>;
  findOne(id: string): Promise<BasicRegistrationResponseDto>;
  update(
    id: string,
    accountInformation: UpdateBasicRegistrationDto,
  ): Promise<BasicRegistrationResponseDto>;
  remove(id: string): Promise<void>;
  addSecurityQuestion(
    securityQuestion: CreateSecurityQuestionDto,
  ): Promise<SecurityQuestionResponseDto>;
  updateSecurityQuestion(
    id: string,
    securityQuestion: UpdateSecurityQuestionDto,
  ): Promise<SecurityQuestionResponseDto>;
  removeSecurityQuestion(id: string): Promise<void>;
}
