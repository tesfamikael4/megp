import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { VendorsEntity } from 'src/entities';

export class VendorInitiationDto {
  id: string;
  @ApiProperty()
  // @IsNotEmpty()
  userId: string;
  @ApiProperty()
  // @IsNotEmpty()
  status: string;
  @ApiProperty()
  @IsOptional()
  name: string;
  level: string;
  @ApiProperty()
  @IsOptional()
  businessType: string;
  @ApiProperty()
  @IsOptional()
  origin: string;
  @ApiProperty()
  // @IsNotEmpty()
  district: string;
  @ApiProperty()
  @IsOptional()
  country: string;
  @ApiProperty()
  @IsOptional()
  tinNumber?: string;

  /**
   * Transfer Data from DTO object to Entity object
   *
   */
  static fromDto(dto: VendorInitiationDto): VendorsEntity {
    const entity = new VendorsEntity();
    if (!dto) {
      return;
    }
    //  entity.id=dto.id;
    entity.id = dto?.id;
    entity.userId = dto.userId;
    entity.status = dto.name;
    entity.name = dto.name;
    entity.formOfEntity = dto.businessType;
    entity.origin = dto.origin;
    entity.district = dto.district;
    entity.country = dto.country;
    entity.origin = dto?.origin;
    return entity;
  }

  /**
   * Transfer list of DTO object to Entity  list
   *
   */
  static fromDtos(vendorInitiationDto: VendorInitiationDto[]): VendorsEntity[] {
    return vendorInitiationDto?.map((regDto) =>
      VendorInitiationDto.fromDto(regDto),
    );
  }
}
export class UpdateVendorInitiationDto extends VendorInitiationDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
  approvedBy: string;
  approvedDate: Date;

  static fromDto(dto: UpdateVendorInitiationDto): VendorsEntity {
    const entity = new VendorsEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.userId = dto.userId;
    entity.status = dto.name;
    entity.name = dto.name;
    entity.formOfEntity = dto.businessType;
    entity.origin = dto.origin;
    entity.district = dto.district;
    entity.country = dto.country;
    entity.origin = dto.origin;
    console.log(entity);
    return entity;
  }
}
/*
RegistrationSettingsResponseDto
*/
export class VendorInitiationResponseDto extends VendorInitiationDto {
  static fromEntity(regDto: VendorsEntity): VendorInitiationResponseDto {
    const response = new VendorInitiationResponseDto();
    response.id = regDto.id;
    response.userId = regDto.userId;
    response.status = regDto.name;
    response.name = regDto.name;
    response.businessType = regDto.formOfEntity;
    response.origin = regDto.origin;
    response.district = regDto.district;
    response.country = regDto.country;
    response.origin = regDto.origin;
    return response;
  }
}
