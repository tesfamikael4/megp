import { ApiProperty } from '@nestjs/swagger';
import { BpServiceEntity } from './entities/bp-service';

export class BpServiceResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  key: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
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
  static toResponse(entity: BpServiceEntity) {
    const response = new BpServiceResponse();
    response.id = entity.id;
    response.key = entity.key;
    response.name = entity.name;
    response.description = entity.description;
    response.isActive = entity.isActive;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.deletedBy = entity.deletedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    return response;
  }
}
