import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { Application } from '../entities/application.entity';
import { PermissionResponseDto } from './permission.dto';

export class CreateApplicationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  organizationId: string;

  static fromDto(applicationDto: CreateApplicationDto): Application {
    const application: Application = new Application();
    // if (!applicationDto) {
    //   return;
    // }
    application.name = applicationDto.name;

    application.description = applicationDto.description;

    application.key = applicationDto.key;

    application.organizationId = applicationDto.organizationId;

    return application;
  }

  static fromDtos(applicationDto: CreateApplicationDto[]) {
    return applicationDto?.map((application) =>
      CreateApplicationDto.fromDto(application),
    );
  }
}

export class UpdateApplicationDto extends CreateApplicationDto {
  @ApiProperty()
  @IsString()
  id: string;
  permissions: PermissionResponseDto[];

  static fromDto(applicationDto: UpdateApplicationDto): Application {
    const application: Application = new Application();
    // if (!applicationDto) {
    //   return;
    // }
    application.id = applicationDto.id;

    application.name = applicationDto.name;

    application.description = applicationDto.description;

    application.key = applicationDto.key;

    application.organizationId = applicationDto.organizationId;

    return application;
  }
}

export class ApplicationResponseDto extends UpdateApplicationDto {
  static toDto(application: Application): ApplicationResponseDto {
    const applicationDto: ApplicationResponseDto = new ApplicationResponseDto();

    applicationDto.id = application.id;

    applicationDto.name = application.name;

    applicationDto.description = application.description;

    applicationDto.key = application.key;

    applicationDto.organizationId = application.organizationId;

    if (application.permissions) {
      applicationDto.permissions = application.permissions.map((permission) => {
        return PermissionResponseDto.toDto(permission);
      });
    }

    return applicationDto;
  }

  static toDtos(applications: Application[]) {
    return applications?.map((application) =>
      ApplicationResponseDto.toDto(application),
    );
  }
}
