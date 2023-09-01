import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsDateString, IsArray, IsObject, IsOptional } from 'class-validator';
import { BasicRegistration } from '../entities/basic-registration.entity';

export class CreateBasicRegistrationDto {

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  alternativeEmail: string;
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  formOfBusiness: string;

  @ApiProperty()
  @IsString()
  companyOrigin: string;

  @ApiProperty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsString()
  country: string;

  static fromDto(accountInformationDto: CreateBasicRegistrationDto): BasicRegistration {
    const accountInformation: BasicRegistration = new BasicRegistration();
    if (!accountInformationDto) {
      return;
    }
    accountInformation.email = accountInformationDto.email;

    accountInformation.phoneNumber = accountInformationDto.phoneNumber;

    accountInformation.name = accountInformationDto.name;

    accountInformation.formOfBusiness = accountInformationDto.formOfBusiness;

    accountInformation.companyOrigin = accountInformationDto.companyOrigin;

    accountInformation.district = accountInformationDto.district;

    accountInformation.country = accountInformationDto.country;

    return accountInformation;
  }

  static fromDtos(accountInformationDto: CreateBasicRegistrationDto[]) {
    return accountInformationDto?.map(accountInformation => CreateBasicRegistrationDto.fromDto(accountInformation));
  }
}


export class UpdateBasicRegistrationDto extends CreateBasicRegistrationDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  superTokenUserId: string;

  static fromDto(accountInformationDto: UpdateBasicRegistrationDto): BasicRegistration {
    const accountInformation: BasicRegistration = new BasicRegistration();
    if (!accountInformationDto) {
      return;
    }
    accountInformation.id = accountInformationDto.id;

    accountInformation.superTokenUserId = accountInformationDto.superTokenUserId;

    accountInformation.email = accountInformationDto.email;

    accountInformation.phoneNumber = accountInformationDto.phoneNumber;

    accountInformation.alternativeEmail = accountInformationDto.alternativeEmail;

    accountInformation.name = accountInformationDto.name;

    accountInformation.formOfBusiness = accountInformationDto.formOfBusiness;

    accountInformation.companyOrigin = accountInformationDto.companyOrigin;

    accountInformation.district = accountInformationDto.district;

    accountInformation.country = accountInformationDto.country;

    return accountInformation;
  }
}

export class BasicRegistrationResponseDto extends UpdateBasicRegistrationDto {

  static toDto(accountInformation: BasicRegistration): BasicRegistrationResponseDto {
    const accountInformationDto: BasicRegistrationResponseDto = new BasicRegistrationResponseDto();

    accountInformationDto.id = accountInformation.id;

    accountInformationDto.superTokenUserId = accountInformation.superTokenUserId;

    accountInformationDto.email = accountInformation.email;

    accountInformationDto.phoneNumber = accountInformation.phoneNumber;

    accountInformationDto.alternativeEmail = accountInformation.alternativeEmail;

    return accountInformationDto;
  }

  static toDtos(accountInformations: BasicRegistration[]) {
    return accountInformations?.map(accountInformation => BasicRegistrationResponseDto.toDto(accountInformation));
  }
}