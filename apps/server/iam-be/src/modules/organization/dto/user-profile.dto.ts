import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ContactNumberCommand } from 'src/shared/domain/contact-number.dto';
import { UserProfile } from '../entities/user-profile.entity';
export class CreateUserProfileDto {
  userId: string;
  @ApiProperty()
  @IsOptional()
  country: string;
  @ApiProperty()
  @IsOptional()
  profilePhoto: any;
  @ApiProperty()
  @IsOptional()
  region: string;
  @ApiProperty()
  @IsOptional()
  zoneOrSubCity: string;
  @ApiProperty()
  @IsOptional()
  city: string;
  @ApiProperty()
  @IsOptional()
  woreda: string;
  @ApiProperty()
  @IsOptional()
  street: string;
  @ApiProperty()
  houseNumber: string;
  @ApiProperty()
  @IsOptional()
  mobileNumber: ContactNumberCommand;
  @ApiProperty()
  @IsOptional()
  telephone: ContactNumberCommand;
  @ApiProperty()
  @IsOptional()
  fax: ContactNumberCommand;
  @ApiProperty()
  @IsOptional()
  postalCode: string;
  static fromDto(userProfileDto: CreateUserProfileDto): UserProfile {
    const userProfile: UserProfile = new UserProfile();
    userProfile.userId = userProfileDto.userId;
    userProfile.country = userProfileDto.country;
    userProfile.region = userProfileDto.region;
    userProfile.zoneOrSubCity = userProfileDto.zoneOrSubCity;
    userProfile.city = userProfileDto.city;
    userProfile.woreda = userProfileDto.woreda;
    userProfile.street = userProfileDto.street;
    userProfile.houseNumber = userProfileDto.houseNumber;
    userProfile.mobileNumber = userProfileDto.mobileNumber;
    userProfile.telephone = userProfileDto.telephone;
    userProfile.fax = userProfileDto.fax;
    userProfile.postalCode = userProfileDto.postalCode;
    userProfile.profilePhoto = userProfileDto.profilePhoto;

    return userProfile;
  }

  static fromDtos(userProfileDto: CreateUserProfileDto[]) {
    return userProfileDto?.map((userProfile) =>
      CreateUserProfileDto.fromDto(userProfile),
    );
  }
}

export class UpdateUserProfileDto extends CreateUserProfileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;

  static fromDto(userProfileDto: UpdateUserProfileDto): UserProfile {
    const userProfile: UserProfile = new UserProfile();
    // if (!userProfileDto) {
    //   return;
    // }
    userProfile.id = userProfileDto.id;
    userProfile.userId = userProfileDto.userId;
    userProfile.country = userProfileDto.country;
    userProfile.region = userProfileDto.region;
    userProfile.zoneOrSubCity = userProfileDto.zoneOrSubCity;
    userProfile.city = userProfileDto.city;
    userProfile.woreda = userProfileDto.woreda;
    userProfile.street = userProfileDto.street;
    userProfile.houseNumber = userProfileDto.houseNumber;
    userProfile.mobileNumber = userProfileDto.mobileNumber;
    userProfile.telephone = userProfileDto.telephone;
    userProfile.fax = userProfileDto.fax;
    userProfile.postalCode = userProfileDto.postalCode;
    userProfile.profilePhoto = userProfileDto.profilePhoto;

    return userProfile;
  }
}

export class UserProfileResponseDto extends UpdateUserProfileDto {
  static toDto(userProfile: UserProfile): UserProfileResponseDto {
    const userProfileDto: UserProfileResponseDto = new UserProfileResponseDto();

    userProfileDto.id = userProfile.id;

    userProfileDto.id = userProfile.id;
    userProfileDto.userId = userProfile.userId;
    userProfileDto.country = userProfile.country;
    userProfileDto.region = userProfile.region;
    userProfileDto.zoneOrSubCity = userProfile.zoneOrSubCity;
    userProfileDto.city = userProfile.city;
    userProfileDto.woreda = userProfile.woreda;
    userProfileDto.street = userProfile.street;
    userProfileDto.houseNumber = userProfile.houseNumber;
    userProfileDto.mobileNumber = userProfile.mobileNumber;
    userProfileDto.telephone = userProfile.telephone;
    userProfileDto.fax = userProfile.fax;
    userProfileDto.postalCode = userProfile.postalCode;
    userProfileDto.profilePhoto = userProfile.profilePhoto;

    return userProfileDto;
  }

  static toDtos(userProfiles: UserProfile[]) {
    return userProfiles?.map((userProfile) =>
      UserProfileResponseDto.toDto(userProfile),
    );
  }
}
