import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { VendorsEntity } from 'src/entities';

export class VendorInitiationDto {
  id: string;
  @ApiProperty()
  // @IsNotEmpty()
  userId: string;
  @ApiProperty()
  @IsOptional()
  name: string;
  @ApiProperty()
  @IsOptional()
  businessType: string;
  @ApiProperty()
  @IsNotEmpty()
  countryOfRegistration: string;
  @ApiProperty()
  @IsOptional()
  tinNumber?: string;
  @ApiProperty()
  @IsOptional()
  tinIssuedDate?: string;

  @IsOptional()
  address: any;

  @IsOptional()
  basic: any;

  @ApiProperty()
  @IsString()
  @IsOptional()
  registrationNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  registrationIssuedDate: string;
  @ApiProperty()
  status: string
  level: string
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

    console.log(entity);
    return entity;
  }
}
/*
RegistrationSettingsResponseDto
*/
export class VendorInitiationResponseDto extends VendorInitiationDto {
  static toResponse(regDto: VendorsEntity): VendorInitiationResponseDto {
    const response = new VendorInitiationResponseDto();
    response.id = regDto.id;
    response.userId = regDto.userId;
    response.name = regDto.name;
    response.businessType = regDto.formOfEntity;
    return response;
  }
}
