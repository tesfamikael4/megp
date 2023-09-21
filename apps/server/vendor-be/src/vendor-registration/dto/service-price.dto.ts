import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { ServicePriceEntity } from '../entities/service-price.entity';
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
  contractValue: string;
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
    entity.contractValue = dto.contractValue;
    //entity.valueTo = dto.valueTo;
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
    entity.contractValue = dto.contractValue;
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
  static fromEntity(dto: ServicePriceEntity): ServicePriceResponseDto {
    const response = new ServicePriceResponseDto();
    response.id = dto.id;
    response.serviceId = dto.serviceId;
    response.businessArea = dto.businessArea;
    response.contractValue = dto.contractValue;
    response.currency = dto?.currency;
    response.fee = dto.fee;
    return response;
  }
}
