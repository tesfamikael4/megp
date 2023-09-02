import { AccountInformation } from '../entities/account-information.entity';
export declare class CreateAccountInformationDto {
  email: string;
  phoneNumber: string;
  alternativeEmail: string;
  static fromDto(
    accountInformationDto: CreateAccountInformationDto,
  ): AccountInformation;
  static fromDtos(
    accountInformationDto: CreateAccountInformationDto[],
  ): AccountInformation[];
}
export declare class UpdateAccountInformationDto extends CreateAccountInformationDto {
  id: string;
  superTokenUserId: string;
  static fromDto(
    accountInformationDto: UpdateAccountInformationDto,
  ): AccountInformation;
}
export declare class AccountInformationResponseDto extends UpdateAccountInformationDto {
  static toDto(
    accountInformation: AccountInformation,
  ): AccountInformationResponseDto;
  static toDtos(
    accountInformations: AccountInformation[],
  ): AccountInformationResponseDto[];
}
