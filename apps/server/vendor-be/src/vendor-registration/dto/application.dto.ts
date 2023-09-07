import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApplicationEntity } from '../entities/application.entity';
import { CreateBusinessCategoryDto } from './business-category.dto';
import { CreateCustomCategoryDto } from './custom-category.dto';

export class CreateApplicationDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  vendorId: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  serviceId: string; //new renew  Upgrade
  @ApiProperty()
  @IsNotEmpty()
  Status: string;
  @ApiProperty()
  businessArea: string; //Goods| Services
  ///system data
  submissionDate: Date;
  // approvedBy: string;
  // approvedDate: Date;

  @ApiProperty()
  commonCategories: CreateBusinessCategoryDto[];
  @ApiProperty()
  CustomCategories: CreateCustomCategoryDto[];

  /**
   * Transfer Data from DTO object to Entity object
   *
   */
  static fromDto(dto: CreateApplicationDto): ApplicationEntity {
    const entity = new ApplicationEntity();
    if (!dto) {
      return;
    }
    //  entity.id=dto.id;
    entity.vendorId = dto.vendorId;
    entity.serviceId = dto.serviceId;
    entity.businessArea = dto.businessArea;
    entity.status = dto.Status;
    if (entity.status) {
      entity.submissionDate = new Date();
    }
    entity.submissionDate = dto.submissionDate ? dto.submissionDate : null;
    entity.businessCats = dto.commonCategories
      ? dto.commonCategories.map((item) =>
          CreateBusinessCategoryDto.fromDto(item),
        )
      : null;
    entity.customCats = dto.CustomCategories
      ? dto.CustomCategories.map((item) =>
          CreateCustomCategoryDto.fromDto(item),
        )
      : null;

    console.log(entity);
    return entity;
  }

  /**
   * Transfer list of DTO object to Entity  list
   *
   */
  static fromDtos(
    registrationDtos: CreateApplicationDto[],
  ): ApplicationEntity[] {
    return registrationDtos?.map((regDto) =>
      CreateApplicationDto.fromDto(regDto),
    );
  }
}
export class UpdateApplicationDto extends CreateApplicationDto {
  @ApiProperty()
  @IsUUID()
  id: string;
  approvedBy: string;
  approvedDate: Date;

  static fromDto(dto: UpdateApplicationDto): ApplicationEntity {
    const entity = new ApplicationEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.serviceId = dto.serviceId;
    entity.businessArea = dto.businessArea;
    entity.vendorId = dto.vendorId;
    entity.status = dto.Status;
    console.log(entity);
    return entity;
  }
}
/*
RegistrationSettingsResponseDto 
*/
export class ApplicationResponseDto extends UpdateApplicationDto {
  static fromEntity(regDto: ApplicationEntity): ApplicationResponseDto {
    const response = new ApplicationResponseDto();
    response.id = regDto.id;
    response.vendorId = regDto.vendorId;
    response.serviceId = regDto.serviceId;
    response.businessArea = regDto.businessArea;
    response.Status = regDto.status;
    response.approvedBy = regDto.approvedBy;
    response.approvedDate = regDto.approvedDate;
    response.submissionDate = regDto.submissionDate;
    return response;
  }
}
