import { BasicRegistration } from '../entities/basic-registration.entity';
export declare class CreateBasicRegistrationDto {
  name: string;
  formOfBusiness: string;
  companyOrigin: string;
  district: string;
  country: string;
  accountInformationId: string;
  static fromDto(
    basicRegistrationDto: CreateBasicRegistrationDto,
  ): BasicRegistration;
  static fromDtos(
    basicRegistrationDto: CreateBasicRegistrationDto[],
  ): BasicRegistration[];
}
export declare class UpdateBasicRegistrationDto extends CreateBasicRegistrationDto {
  id: string;
  static fromDto(
    basicRegistrationDto: UpdateBasicRegistrationDto,
  ): BasicRegistration;
}
export declare class BasicRegistrationResponseDto extends UpdateBasicRegistrationDto {
  static toDto(
    basicRegistration: BasicRegistration,
  ): BasicRegistrationResponseDto;
  static toDtos(
    basicRegistrations: BasicRegistration[],
  ): BasicRegistrationResponseDto[];
}
