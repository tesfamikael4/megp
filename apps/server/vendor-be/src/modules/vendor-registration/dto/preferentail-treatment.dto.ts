import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { PreferentialTreatmentsEntity } from 'src/entities/preferential-treatment.entity';
export class CreatePTDto {
  @ApiProperty()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty()
  @IsNotEmpty()
  certiNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  category: string;
  @ApiProperty()
  @IsNotEmpty()
  type: string;
  @ApiProperty()
  @IsOptional()
  certificateValidityPeriod: Date;
  @ApiProperty()
  @IsOptional()
  certificateIssuedDate: Date;
  @ApiProperty()
  @IsNotEmpty()
  status: string;

  static fromDto(dto: CreatePTDto): PreferentialTreatmentsEntity {
    const entity = new PreferentialTreatmentsEntity();
    if (!dto) {
      return;
    }
    entity.serviceId = dto.serviceId;
    entity.certiNumber = dto.certiNumber;
    entity.category = dto.category;
    entity.type = dto.type;
    entity.certificateIssuedDate = dto.certificateIssuedDate;
    entity.certificateValidityPeriod = dto.certificateValidityPeriod;

    return entity;
  }
}
export class UpdatePTDto extends CreatePTDto {
  @ApiProperty()
  @IsUUID()
  id: string;
  static fromDto(dto: UpdatePTDto): PreferentialTreatmentsEntity {
    const entity = new PreferentialTreatmentsEntity();
    if (!dto) {
      return;
    }

    entity.serviceId = dto.serviceId;
    entity.certiNumber = dto.certiNumber;
    entity.category = dto.category;
    entity.type = dto.type;
    entity.certificateIssuedDate = dto.certificateIssuedDate;
    entity.certificateValidityPeriod = dto.certificateValidityPeriod;
    return entity;
  }
}
export class PTResponse extends UpdatePTDto {
  createdAt: Date;
  @ApiProperty()
  status: string;
  @ApiProperty()
  certificateUrl: string;
  @ApiProperty()
  vendorId: string;
  static toResponse(entity: PreferentialTreatmentsEntity): PTResponse {
    const response = new PTResponse();
    response.serviceId = entity.serviceId;
    response.status = entity.status;
    response.certificateUrl = entity.certificateUrl;
    response.serviceId = entity.serviceId;
    response.certiNumber = entity.certiNumber;
    response.category = entity.category;
    response.type = entity.type;
    response.certificateIssuedDate = entity.certificateIssuedDate;
    response.certificateValidityPeriod = entity.certificateValidityPeriod;
    return response;
  }
}
