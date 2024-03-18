import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { PreferentialTreatmentsEntity } from 'src/entities/preferential-treatment.entity';
export class CreatePTDto {
  @ApiProperty()
  @IsNotEmpty()
  serviceId: string;
  @ApiProperty()
  @IsNotEmpty()
  status: string;
  @ApiProperty()
  @IsNotEmpty()
  certiNumber: string;

  static fromDto(dto: CreatePTDto): PreferentialTreatmentsEntity {
    const entity = new PreferentialTreatmentsEntity();
    if (!dto) {
      return;
    }
    entity.serviceId = dto.serviceId;
    entity.certiNumber = dto.certiNumber;
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
    return response;
  }
}
