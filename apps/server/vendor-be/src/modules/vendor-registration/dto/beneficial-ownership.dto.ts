import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { BeneficialOwnership } from 'src/entities';

export class CreateBeneficialOwnershipDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty()
  @IsNotEmpty()
  lastName: string;
  @ApiProperty()
  @IsNotEmpty()
  nationality: string;
  @ApiProperty()
  @IsNotEmpty()
  vendorId: string;
  createdAt: Date;
  createdBy: string;
  // deletedAt: Date;
  // deletedBy: string;
  updatedAt: Date;
  updatedBy: string;

  static fromDto(dto: CreateBeneficialOwnershipDto): BeneficialOwnership {
    const entity = new BeneficialOwnership();
    if (!dto) {
      return;
    }
    entity.id = dto?.id;
    entity.firstName = dto.firstName;
    entity.lastName = dto.lastName;
    entity.nationality = dto.nationality;
    entity.vendorId = dto.vendorId;
    entity.createdAt = dto.createdAt;
    // entity.createdBy = dto.createdBy;
    // entity.deletedAt = dto.deletedAt;
    //  entity.deletedBy = dto.deletedBy;
    entity.updatedAt = dto.updatedAt;
    // entity.updatedBy = dto.updatedBy;
    return entity;
  }
}
export class BeneficialOwnershipResponse extends CreateBeneficialOwnershipDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
  static fromEntity(dto: BeneficialOwnership): BeneficialOwnershipResponse {
    const response = new BeneficialOwnershipResponse();
    if (!dto) {
      return;
    }
    response.id = dto?.id;
    response.firstName = dto.firstName;
    response.lastName = dto.lastName;
    response.nationality = dto.nationality;
    response.vendorId = dto.vendorId;

    response.createdAt = dto.createdAt;
    // response.createdBy = dto.createdBy;
    //   response.deletedAt = dto.deletedAt;
    // response.deletedBy = dto.deletedBy;
    response.updatedAt = dto.updatedAt;
    // response.updatedBy = dto.updatedBy;
    return response;
  }
}
