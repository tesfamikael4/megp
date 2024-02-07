import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { ContactNumber } from 'src/shared/entities/contact-number';
import { UserProfileResponseDto } from './user-profile.dto';
import { CreateUserRoleDto } from '../../role/dto/user-role.dto';
import { CreateUserUnitDto } from './user-unit.dto';
import { account } from '../../seeders/seed-data';
import { User } from 'src/entities';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  accountId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  phone: ContactNumber;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isLock: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsString()
  organizationId: string;
}

export class UpdateUserDto extends CreateUserDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class UserResponseDto extends UpdateUserDto {
  userProfile: UserProfileResponseDto;

  userUnits: CreateUserUnitDto[];

  userRoles: CreateUserRoleDto[];

  static toDto(user: User): UserResponseDto {
    const response = new UserResponseDto();

    response.id = user.id;
    response.accountId = user.accountId;
    response.firstName = user.account.firstName;
    response.lastName = user.account.lastName;
    response.email = user.account.email;
    response.username = user.account.username;
    response.status = user.status;

    return response;
  }

  static toDtos(users: User[]): UserResponseDto[] {
    return users.map((user) => UserResponseDto.toDto(user));
  }
}

export class InviteUserDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
