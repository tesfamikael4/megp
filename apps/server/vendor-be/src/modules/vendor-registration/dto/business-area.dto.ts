import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { BusinessAreaEntity } from 'src/entities';
export class CreateBusinessAreaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  vendorId: string;
  @IsNotEmpty()
  @ApiProperty()
  category: string;
  @IsNotEmpty()
  @ApiProperty()
  instanceId: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  approvedAt: Date;
  @ApiProperty()
  expireDate: Date;
  static fromDto(dto: CreateBusinessAreaDto): BusinessAreaEntity {
    const entity = new BusinessAreaEntity();
    if (!dto) return;
    entity.vendorId = dto.vendorId;
    entity.instanceId = dto.instanceId;
    entity.category = dto.category;
    entity.status = dto?.status;
    entity.approvedAt = dto?.approvedAt;
    entity.expireDate = dto?.expireDate;
    return entity;
  }
  static fromDtos(dto: CreateBusinessAreaDto[]): BusinessAreaEntity[] {
    return dto.map((element) => this.fromDto(element));
  }
}
export class UpdateBusinessAreaDto extends CreateBusinessAreaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  static fromDto(dto: UpdateBusinessAreaDto): BusinessAreaEntity {
    const entity = new BusinessAreaEntity();
    if (!dto) return;
    entity.id = dto.id;
    entity.vendorId = dto.vendorId;
    entity.instanceId = dto.instanceId;
    entity.category = dto.category;
    entity.status = dto?.status;
    entity.expireDate = dto?.expireDate;
    entity.approvedAt = dto?.approvedAt;
    return entity;
  }
  static fromDtos(dto: UpdateBusinessAreaDto[]): BusinessAreaEntity[] {
    return dto.map((element) => this.fromDto(element));
  }
}
export class BusinessAreaResponseDto extends CreateBusinessAreaDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsOptional()
  certificateUrl: string;
  static toResponse(entity: BusinessAreaEntity): BusinessAreaResponseDto {
    const response = new BusinessAreaResponseDto();
    response.id = entity.id;
    response.category = entity.category;
    response.vendorId = entity.vendorId;
    response.instanceId = entity.instanceId;
    response.status = entity.status;
    response.expireDate = entity.expireDate;
    response.approvedAt = entity.approvedAt;
    response.certificateUrl = entity?.certificateUrl;
    return response;
  }
  static toResponses(entity: BusinessAreaEntity[]): BusinessAreaResponseDto[] {
    return entity.map((element) => this.toResponse(element));
  }
}

export class BusinessAreaDetailResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  category: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  approvedAt: Date;
  @ApiProperty()
  expireDate: Date;
  @ApiProperty()
  service: string;
  @ApiProperty()
  valueFrom: number;
  @ApiProperty()
  valueTo: any;
  @ApiProperty()
  currency: string;
  @ApiProperty()
  certificateUrl: string;
  lineOfBusiness: string[];
  priceRange: string;
  static toResponse(entity: BusinessAreaEntity): BusinessAreaDetailResponseDto {
    const response = new BusinessAreaDetailResponseDto();
    response.id = entity.id;
    response.category = entity.category;
    response.priceRange = '';
    // response.service = entity.BpService.name;
    response.status = entity.status;
    response.approvedAt = entity?.approvedAt;
    response.expireDate = entity?.expireDate;
    response.valueFrom = entity.servicePrice?.valueFrom;
    response.valueTo = entity.servicePrice?.valueTo;
    response.currency = entity.servicePrice?.currency;
    response.certificateUrl = entity?.certificateUrl;
    return response;
  }
}
