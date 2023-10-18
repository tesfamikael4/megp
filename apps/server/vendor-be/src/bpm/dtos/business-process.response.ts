import { ApiProperty } from '@nestjs/swagger';
import { BusinessProcessEntity } from '../entities/business-process';

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
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  static toResponse(entity: BusinessProcessEntity) {
    const response = new BusinessProcessResponse();
    response.id = entity.id;
    response.serviceId = entity.serviceId;
    response.version = entity.version;
    response.isActive = entity.isActive;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;

    return response;
  }
}
