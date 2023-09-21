import { ApiProperty } from '@nestjs/swagger';
import { BusinessProcessEntity } from './entities/business-process';

export class BusinessProcessResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  serviceId: string;
  @ApiProperty()
  workflow: object;
  @ApiProperty()
  version: number;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  organizationId?: string;
  @ApiProperty()
  organizationName?: string;
  @ApiProperty()
  createdBy: string;
  @ApiProperty()
  updatedBy: string;
  @ApiProperty()
  deletedBy: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt: Date;
  static toResponse(entity: BusinessProcessEntity) {
    const response = new BusinessProcessResponse();
    response.id = entity.id;
    response.serviceId = entity.serviceId;
    response.workflow = entity.workflow;
    response.version = entity.version;
    response.isActive = entity.isActive;
    response.organizationId = entity.organizationId;
    response.organizationName = entity.organizationName;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.deletedBy = entity.deletedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    return response;
  }
}
