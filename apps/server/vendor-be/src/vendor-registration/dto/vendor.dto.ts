import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsUUID } from 'class-validator';
import { VendorsEntity } from '../entities/vendors.entity';
import { CreateBusinessCategoryDto } from './business-category.dto';
import { CreateCustomCategoryDto } from './custom-category.dto';
import { CreateShareholdersDto } from './shareholder.dto';
import { CreateWorkflowInstanceDto } from 'src/bpm/workflow-instances/dtos/workflow-instance.dto';

export class CreateVendorsDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  tin: string;
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
  @ApiProperty()
  @IsNotEmpty()
  status: string;
  //legal form of entity
  @ApiProperty()
  @IsNotEmpty()
  formOfEntity: string;
  @ApiProperty()
  @IsNotEmpty()
  country: string;
  @ApiProperty()
  @IsNotEmpty()
  metaData: JSON;

  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  district: string;

  @ApiProperty()
  @IsNotEmpty()
  origin: string;

  @ApiProperty()
  commonCategories: CreateBusinessCategoryDto[];
  @ApiProperty()
  CustomCategories: CreateCustomCategoryDto[];

  @ApiProperty()
  appliactions: CreateWorkflowInstanceDto[];
  @ApiProperty()
  shareholders: CreateShareholdersDto[];

  static fromDto(dto: CreateVendorsDto): VendorsEntity {
    const entity = new VendorsEntity();
    if (!dto) {
      return;
    }
    entity.id = dto?.id;
    entity.tin = dto.tin;
    entity.country = dto.country;
    entity.formOfEntity = dto.formOfEntity;
    entity.status = dto.status;
    entity.userId = dto.userId;

    entity.district = dto.district;
    entity.name = dto.name;
    entity.origin = dto.origin;

    entity.metaData = dto.metaData;
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

    entity.instances = dto.appliactions
      ? dto.appliactions.map((item) => CreateWorkflowInstanceDto.fromDto(item))
      : null;

    entity.shareholders = dto.shareholders
      ? dto.shareholders.map((item) => CreateShareholdersDto.fromDto(item))
      : null;

    return entity;
  }
}
export class UpdateVendorsDto extends CreateVendorsDto {
  @ApiProperty()
  @IsUUID()
  id: string;
  static fromDto(dto: UpdateVendorsDto): VendorsEntity {
    const entity = new VendorsEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.tin = dto.tin;
    entity.userId = dto.userId;
    entity.country = dto.country;
    entity.formOfEntity = dto.status;
    entity.metaData = dto.metaData;
    entity.district = dto.district;
    entity.name = dto.name;
    entity.origin = dto.origin;
    return entity;
  }
}
export class VendorsResponseDto extends UpdateVendorsDto {
  static fromEntity(entity: VendorsEntity): VendorsResponseDto {
    const response = new VendorsResponseDto();
    response.id = entity.id;
    response.tin = entity.tin;
    response.userId = entity.userId;
    response.country = entity.country;
    response.name = entity.name;
    response.status = entity.formOfEntity;
    response.metaData = entity.metaData;
    response.district = entity.district;
    response.origin = entity.origin;
    return response;
  }
}
