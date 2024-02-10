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
  @ApiProperty()
  @IsOptional()
  extendedProfile: any;
  // @ApiProperty()
  // @IsOptional()
  // otherDocumentsMetadata: any;
  @ApiProperty()
  @IsNotEmpty()
  remark: string;
  // @ApiProperty()
  // @IsNotEmpty()
  // certificate: Express.Multer.File;
  // @ApiProperty()
  // @IsOptional()
  // otherDocuments: Express.Multer.File[];
  /**
   * Transfer Data from DTO object to Entity object
   *
   */
  static fromDto(dto: CreatePTDto): PreferentialTreatmentsEntity {
    const entity = new PreferentialTreatmentsEntity();
    if (!dto) {
      return;
    }
    entity.serviceId = dto.serviceId;
    entity.remark = dto.remark;
    entity.extendedProfile = dto.extendedProfile;
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
    entity.remark = dto.remark;
    entity.extendedProfile = dto.extendedProfile;
    return entity;
  }
}
export class PTResponse extends UpdatePTDto {
  createdAt: Date;
  @ApiProperty()
  status: string;
  @ApiProperty()
  otherDocuments: any;
  @ApiProperty()
  certificateUrl: string;
  @ApiProperty()
  vendorId: string;
  static toResponse(entity: PreferentialTreatmentsEntity): PTResponse {
    const response = new PTResponse();
    response.vendorId = entity.vendorId;
    response.serviceId = entity.serviceId;
    response.remark = entity.remark;
    response.extendedProfile = entity.extendedProfile;
    response.otherDocuments = entity.otherDocuments;
    response.status = entity.status;
    response.certificateUrl = entity.certificateUrl;
    return response;
  }
}
