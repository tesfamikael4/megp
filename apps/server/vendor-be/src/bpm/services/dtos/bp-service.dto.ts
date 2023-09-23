import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { BpServiceEntity } from '../entities/bp-service';

export class CreateBpServiceDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  key: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  isActive: boolean;
  organizationId: string;
  organizationName: string;
  /**
   * Transfer Data from DTO object to Entity object
   *
   */
  static fromDto(dto: CreateBpServiceDto): BpServiceEntity {
    const entity = new BpServiceEntity();
    if (!dto) {
      return null;
    }
    entity.name = dto.name;
    entity.key = dto.key;
    entity.description = dto.description;
    entity.organizationId = dto.organizationId;
    entity.organizationName = dto.organizationId;
    return entity;
  }

  /**
   * Transfer list of DTO object to Entity  list
   *
   */
  static fromDtos(dto: CreateBpServiceDto[]): BpServiceEntity[] {
    return dto?.map((d) => CreateBpServiceDto.fromDto(d));
  }
}
export class UpdateBpServiceDto extends CreateBpServiceDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  description: string;
  isActive: boolean;

  static fromDto(dto: UpdateBpServiceDto): BpServiceEntity {
    const entity = new BpServiceEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.description = dto.description;
    entity.name = dto.name;
    entity.isActive = dto.isActive;
    return entity;
  }
}
