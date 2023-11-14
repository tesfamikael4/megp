import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { BusinessProcessEntity } from 'src/entities/business-process.entity';

export class CreateBusinessProcessDto {
  @ApiProperty()
  @IsNotEmpty()
  serviceId: string;
  @ApiProperty()
  @IsNotEmpty()
  workflow: object;
  @ApiProperty()
  @IsNumber()
  version: number;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  convertToStateMachine: boolean;
  organizationId: string;
  organizationName: string;
  /**
   * Transfer Data from DTO object to Entity object
   *
   */
  static fromDto(dto: CreateBusinessProcessDto): BusinessProcessEntity {
    const entity = new BusinessProcessEntity();
    if (!dto) {
      return null;
    }
    entity.serviceId = dto.serviceId;
    entity.version = dto.version;
    //entity.workflow = dto.workflow;
    entity.organizationId = dto.organizationId;
    entity.organizationName = dto.organizationId;
    return entity;
  }

  /**
   * Transfer list of DTO object to Entity  list
   *
   */
  static fromDtos(dto: CreateBusinessProcessDto[]): BusinessProcessEntity[] {
    return dto?.map((d) => CreateBusinessProcessDto.fromDto(d));
  }
}
export class UpdateBusinessProcessDto extends CreateBusinessProcessDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  serviceId: string;
  @ApiProperty()
  @IsNumber()
  version: number;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  workflow: object;

  static fromDto(dto: UpdateBusinessProcessDto): BusinessProcessEntity {
    const entity = new BusinessProcessEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.version = dto.version;
    entity.serviceId = dto.serviceId;
    entity.workflow = dto.workflow;
    entity.isActive = dto.isActive;
    return entity;
  }
}

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
