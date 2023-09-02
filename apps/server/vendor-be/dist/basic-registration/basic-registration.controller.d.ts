import { CollectionQuery } from '@collection-query';
import {
  CreateBasicRegistrationDto,
  UpdateBasicRegistrationDto,
} from './dto/basic-registration.dto';
import {
  CreateSecurityQuestionDto,
  UpdateSecurityQuestionDto,
} from './dto/security-question.dto';
import { BasicRegistrationService } from './basic-registration.service';
export declare class BasicRegistrationController {
  private readonly basicRegistrationService;
  constructor(basicRegistrationService: BasicRegistrationService);
  create(
    createBasicRegistrationDto: CreateBasicRegistrationDto,
  ): Promise<
    import('./dto/basic-registration.dto').BasicRegistrationResponseDto
  >;
  findOne(
    id: string,
  ): Promise<
    import('./dto/basic-registration.dto').BasicRegistrationResponseDto
  >;
  findAll(
    query: CollectionQuery,
  ): Promise<
    import('@api-data').DataResponseFormat<
      import('./dto/basic-registration.dto').BasicRegistrationResponseDto
    >
  >;
  update(
    id: string,
    updateBasicRegistrationDto: UpdateBasicRegistrationDto,
  ): Promise<
    import('./dto/basic-registration.dto').BasicRegistrationResponseDto
  >;
  remove(id: string): Promise<void>;
  addSecurityQuestion(
    createSecurityQuestionDto: CreateSecurityQuestionDto,
  ): Promise<import('./dto/security-question.dto').SecurityQuestionResponseDto>;
  editSecurityQuestion(
    id: string,
    createSecurityQuestionDto: UpdateSecurityQuestionDto,
  ): Promise<import('./dto/security-question.dto').SecurityQuestionResponseDto>;
  removeSecurityQuestion(id: string): Promise<void>;
}
