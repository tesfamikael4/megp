import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { User } from '../entities/employee.entity';
import { ContactNumber } from 'src/shared/domain/contact-number';
import {
  CreateUserProfileDto,
  UserProfileResponseDto,
} from './employee-profile.dto';
import { CreateUserRoleDto, UserRoleResponseDto } from './employee-role.dto';
import { CreateUserUnitDto, UserUnitResponseDto } from './employee-unit.dto';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  superTokenUserId: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  fullName: string;

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

  static fromDto(userDto: CreateUserDto): User {
    const user: User = new User();
    // if (!userDto) {
    //   return;
    // }
    user.superTokenUserId = userDto.superTokenUserId;

    user.username = userDto.username;

    user.firstName = userDto.firstName;

    user.lastName = userDto.lastName;

    user.fullName = userDto.fullName;

    user.email = userDto.email;

    user.phone = userDto.phone;

    user.isLock = userDto.isLock;

    user.isActive = userDto.isActive;

    user.status = userDto.status;

    user.organizationId = userDto.organizationId;

    return user;
  }

  static fromDtos(userDto: CreateUserDto[]) {
    return userDto?.map((user) => CreateUserDto.fromDto(user));
  }
}

export class UpdateUserDto extends CreateUserDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  userProfile: CreateUserProfileDto;

  userUnits: CreateUserUnitDto[];

  userRoles: CreateUserRoleDto[];
  static fromDto(userDto: UpdateUserDto): User {
    const user: User = new User();
    // if (!userDto) {
    //   return;
    // }
    user.id = userDto.id;

    user.superTokenUserId = userDto.superTokenUserId;

    user.username = userDto.username;

    user.firstName = userDto.firstName;

    user.lastName = userDto.lastName;

    user.fullName = userDto.fullName;

    user.email = userDto.email;

    user.phone = userDto.phone;

    user.isLock = userDto.isLock;

    user.isActive = userDto.isActive;

    user.status = userDto.status;

    user.organizationId = userDto.organizationId;

    if (user.userProfile) {
      user.userProfile = UserProfileResponseDto.fromDto(user.userProfile);
    }

    if (userDto.userUnits) {
      user.userUnits = UserUnitResponseDto.fromDtos(user.userUnits);
    }

    if (userDto.userRoles) {
      user.userRoles = UserRoleResponseDto.fromDtos(user.userRoles);
    }

    return user;
  }
}

export class UserResponseDto extends UpdateUserDto {
  static toDto(user: User): UserResponseDto {
    const userDto: UserResponseDto = new UserResponseDto();

    userDto.id = user.id;

    userDto.superTokenUserId = user.superTokenUserId;

    userDto.username = user.username;

    userDto.firstName = user.firstName;

    userDto.lastName = user.lastName;

    userDto.fullName = user.fullName;

    userDto.email = user.email;

    userDto.phone = user.phone;

    userDto.isLock = user.isLock;

    userDto.isActive = user.isActive;

    userDto.status = user.status;

    userDto.organizationId = user.organizationId;

    if (user.userProfile) {
      userDto.userProfile = UserProfileResponseDto.toDto(user.userProfile);
    }

    if (user.userUnits) {
      userDto.userUnits = UserUnitResponseDto.toDtos(user.userUnits);
    }

    if (user.userRoles) {
      userDto.userRoles = UserRoleResponseDto.toDtos(user.userRoles);
    }

    return userDto;
  }

  static toDtos(users: User[]) {
    return users?.map((user) => UserResponseDto.toDto(user));
  }
}
