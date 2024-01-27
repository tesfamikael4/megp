import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { UserProfile } from 'src/entities';

export class CreateUserProfileDto {
  @ApiProperty()
  @IsUUID()
  accountId: string;

  @ApiProperty()
  extendedProfile: any;
}

export class UpdateUserProfileDto extends CreateUserProfileDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class UserProfileResponseDto extends UpdateUserProfileDto {
  static toDto(userProfile: UserProfile): UserProfileResponseDto {
    const userProfileDto: UserProfileResponseDto = new UserProfileResponseDto();

    userProfileDto.id = userProfile.id;

    userProfileDto.accountId = userProfile.accountId;

    userProfileDto.extendedProfile = userProfile.extendedProfile;

    return userProfileDto;
  }
}
