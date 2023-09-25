import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { ServicePriceEntity } from '../entities/service-price.entity';
import { BpServiceResponse } from 'src/bpm/services/bp-service.response';
export class CreateServicePriceDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  serviceId: string;
  @ApiProperty()
  @IsNotEmpty()
  businessArea: string;
  @ApiProperty()
  @IsNotEmpty()
  valueFrom: number;
  @ApiProperty()
  @IsNotEmpty()
  valueTo: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  fee: number;
  @ApiProperty()
  @IsOptional()
  currency?: string;

  /**
   * Transfer Data from DTO object to Entity object
   *
   */
  static fromDto(dto: CreateServicePriceDto): ServicePriceEntity {
    const entity = new ServicePriceEntity();
    if (!dto) {
      return;
    }
    entity.serviceId = dto.serviceId;
    entity.businessArea = dto.businessArea;
    entity.valueFrom = dto.valueFrom;
    entity.valueTo = dto.valueTo;
    entity.fee = dto.fee;
    entity.currency = dto?.currency;
    console.log(dto);
    return entity;
  }

  /**
   * Transfer list of DTO object to Entity  list
   *
   */
  static fromDtos(
    registrationDtos: CreateServicePriceDto[],
  ): ServicePriceEntity[] {
    return registrationDtos?.map((regDto) =>
      CreateServicePriceDto.fromDto(regDto),
    );
  }
}
export class UpdateServicePriceDto extends CreateServicePriceDto {
  @ApiProperty()
  @IsUUID()
  id: string;
  static fromDto(dto: UpdateServicePriceDto): ServicePriceEntity {
    const entity = new ServicePriceEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.businessArea = dto.businessArea;
    entity.serviceId = dto.serviceId;
    entity.valueFrom = dto.valueFrom;
    entity.valueTo = dto.valueTo;
    entity.currency = dto?.currency;
    entity.fee = dto.fee;
    entity.createdAt = new Date();
    return entity;
  }
}
/*
RegistrationSettingsResponseDto 
*/
export class ServicePriceResponseDto extends UpdateServicePriceDto {
  @ApiProperty()
  @IsNotEmpty()
  service: BpServiceResponse;
  static fromEntity(entity: ServicePriceEntity): ServicePriceResponseDto {
    const response = new ServicePriceResponseDto();
    response.id = entity.id;
    response.serviceId = entity.serviceId;
    response.businessArea = entity.businessArea;
    response.valueFrom = entity.valueFrom;
    response.valueTo = entity.valueTo;
    response.currency = entity?.currency;
    response.fee = entity.fee;
    response.service = entity.service
      ? BpServiceResponse.toResponse(entity.service)
      : null;
    return response;
  }
}
