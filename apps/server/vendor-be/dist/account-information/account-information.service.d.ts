import { Repository } from 'typeorm';
import { AccountInformation } from './entities/account-information.entity';
import { CollectionQuery } from '@collection-query';
import {
  CreateAccountInformationDto,
  UpdateAccountInformationDto,
  AccountInformationResponseDto,
} from './dto/account-information.dto';
import { DataResponseFormat } from '@api-data';
import { BasicRegistration } from './entities/basic-registration.entity';
import {
  CreateBasicRegistrationDto,
  UpdateBasicRegistrationDto,
  BasicRegistrationResponseDto,
} from './dto/basic-registration.dto';
import { SecurityQuestion } from './entities/security-question.entity';
import {
  CreateSecurityQuestionDto,
  UpdateSecurityQuestionDto,
  SecurityQuestionResponseDto,
} from './dto/security-question.dto';
export declare class AccountInformationService {
  private readonly repository;
  private readonly basicRegistrationRepository;
  private readonly securityQuestionRepository;
  constructor(
    repository: Repository<AccountInformation>,
    basicRegistrationRepository: Repository<BasicRegistration>,
    securityQuestionRepository: Repository<SecurityQuestion>,
  );
  registerVendor(user: any, formFields: any): Promise<void>;
  create(
    accountInformation: CreateAccountInformationDto,
  ): Promise<AccountInformationResponseDto>;
  update(
    id: string,
    accountInformation: UpdateAccountInformationDto,
  ): Promise<AccountInformationResponseDto>;
  findAll(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<AccountInformationResponseDto>>;
  findOne(id: string): Promise<AccountInformationResponseDto>;
  remove(id: string): Promise<void>;
  addBasicRegistration(
    basicRegistration: CreateBasicRegistrationDto,
  ): Promise<BasicRegistrationResponseDto>;
  updateBasicRegistration(
    id: string,
    basicRegistration: UpdateBasicRegistrationDto,
  ): Promise<BasicRegistrationResponseDto>;
  removeBasicRegistration(id: string): Promise<void>;
  addSecurityQuestion(
    securityQuestion: CreateSecurityQuestionDto,
  ): Promise<SecurityQuestionResponseDto>;
  updateSecurityQuestion(
    id: string,
    securityQuestion: UpdateSecurityQuestionDto,
  ): Promise<SecurityQuestionResponseDto>;
  removeSecurityQuestion(id: string): Promise<void>;
}
