import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsDateString, IsArray, IsObject, IsOptional } from 'class-validator';
import { Permission } from '../entities/permission.entity';
 

export class CreatePermissionDto {
     
  @ApiProperty()
  @IsString()
  name: string;
    
  @ApiProperty()
  @IsString()
  description: string;
    
  @ApiProperty()
  @IsString()
  applicationId: string;
     
  static fromDto(permissionDto: CreatePermissionDto): Permission {
    const permission: Permission = new Permission();  
    if (!permissionDto) {
      return;
    }
    permission.name = permissionDto.name;
      
    permission.description = permissionDto.description;
      
    permission.applicationId = permissionDto.applicationId;
      
    return permission;
  }

  static fromDtos(permissionDto: CreatePermissionDto[]) {
    return permissionDto?.map(permission => CreatePermissionDto.fromDto(permission));
  }
}


export class UpdatePermissionDto extends CreatePermissionDto {
  @ApiProperty()
  @IsString()
  id: string;

  static fromDto(permissionDto: UpdatePermissionDto): Permission {
    const permission: Permission = new Permission();  
    if (!permissionDto) {
      return;
    }
    permission.id = permissionDto.id;
      
    permission.name = permissionDto.name;
      
    permission.description = permissionDto.description;
      
    permission.applicationId = permissionDto.applicationId;
      
    return permission;
  }
}

export class PermissionResponseDto extends UpdatePermissionDto {

  static toDto(permission:Permission): PermissionResponseDto {
    const permissionDto: PermissionResponseDto = new PermissionResponseDto();  
 
    permissionDto.id = permission.id; 
 
    permissionDto.name = permission.name; 
 
    permissionDto.description = permission.description; 
 
    permissionDto.applicationId = permission.applicationId; 
    
    return permissionDto;
  }

  static toDtos(permissions:Permission[]) {
    return permissions?.map(permission => PermissionResponseDto.toDto(permission));
  }
}