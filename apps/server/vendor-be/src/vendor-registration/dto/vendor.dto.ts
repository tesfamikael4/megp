import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsUUID } from 'class-validator';
import { VendorsEntity } from '../entities/vendors.entity';
import { CreateBusinessCategoryDto } from './business-category.dto';
import { CreateCustomCategoryDto } from './custom-category.dto';

export class CreateVendorsDto {
  @ApiProperty()
  @IsNotEmpty()
  tin: string;
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
  commonCategories: CreateBusinessCategoryDto[];
  @ApiProperty()
  CustomCategories: CreateCustomCategoryDto[];
  static fromDto(dto: CreateVendorsDto): VendorsEntity {
    const entity = new VendorsEntity();
    if (!dto) {
      return;
    }
    //   entity.id = dto.id;
    entity.tin = dto.tin;
    entity.country = dto.country;
    entity.formOfEntity = dto.formOfEntity;
    entity.status = dto.status;
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
    entity.country = dto.country;
    entity.formOfEntity = dto.status;
    entity.metaData = dto.metaData;
    return entity;
  }
}
export class VendorsResponseDto extends UpdateVendorsDto {
  static fromEntity(entity: VendorsEntity): VendorsResponseDto {
    const response = new VendorsResponseDto();
    response.id = entity.id;
    response.tin = entity.tin;
    response.country = entity.country;
    response.status = entity.formOfEntity;
    response.metaData = entity.metaData;
    return response;
  }
}
