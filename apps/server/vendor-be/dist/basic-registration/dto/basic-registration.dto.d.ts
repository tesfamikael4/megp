import { BasicRegistration } from '../entities/basic-registration.entity';
export declare class CreateBasicRegistrationDto {
    email: string;
    phoneNumber: string;
    alternativeEmail: string;
    name: string;
    formOfBusiness: string;
    companyOrigin: string;
    district: string;
    country: string;
    static fromDto(accountInformationDto: CreateBasicRegistrationDto): BasicRegistration;
    static fromDtos(accountInformationDto: CreateBasicRegistrationDto[]): BasicRegistration[];
}
export declare class UpdateBasicRegistrationDto extends CreateBasicRegistrationDto {
    id: string;
    superTokenUserId: string;
    static fromDto(accountInformationDto: UpdateBasicRegistrationDto): BasicRegistration;
}
export declare class BasicRegistrationResponseDto extends UpdateBasicRegistrationDto {
    static toDto(accountInformation: BasicRegistration): BasicRegistrationResponseDto;
    static toDtos(accountInformations: BasicRegistration[]): BasicRegistrationResponseDto[];
}
