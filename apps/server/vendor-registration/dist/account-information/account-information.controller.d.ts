import { CreateAccountInformationDto, UpdateAccountInformationDto } from './dto/account-information.dto';
import { AccountInformationService } from './account-information.service';
import { CollectionQuery } from '@collection-query';
import { CreateBasicRegistrationDto, UpdateBasicRegistrationDto } from './dto/basic-registration.dto';
import { CreateSecurityQuestionDto, UpdateSecurityQuestionDto } from './dto/security-question.dto';
export declare class AccountInformationController {
    private readonly accountInformationService;
    constructor(accountInformationService: AccountInformationService);
    create(createAccountInformationDto: CreateAccountInformationDto): Promise<import("./dto/account-information.dto").AccountInformationResponseDto>;
    findOne(id: string): Promise<import("./dto/account-information.dto").AccountInformationResponseDto>;
    findAll(query: CollectionQuery): Promise<import("@api-data").DataResponseFormat<import("./dto/account-information.dto").AccountInformationResponseDto>>;
    update(id: string, updateAccountInformationDto: UpdateAccountInformationDto): Promise<import("./dto/account-information.dto").AccountInformationResponseDto>;
    remove(id: string): Promise<void>;
    addBasicRegistration(createBasicRegistrationDto: CreateBasicRegistrationDto): Promise<import("./dto/basic-registration.dto").BasicRegistrationResponseDto>;
    editBasicRegistration(id: string, createBasicRegistrationDto: UpdateBasicRegistrationDto): Promise<import("./dto/basic-registration.dto").BasicRegistrationResponseDto>;
    removeBasicRegistration(id: string): Promise<void>;
    addSecurityQuestion(createSecurityQuestionDto: CreateSecurityQuestionDto): Promise<import("./dto/security-question.dto").SecurityQuestionResponseDto>;
    editSecurityQuestion(id: string, createSecurityQuestionDto: UpdateSecurityQuestionDto): Promise<import("./dto/security-question.dto").SecurityQuestionResponseDto>;
    removeSecurityQuestion(id: string): Promise<void>;
}
