import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { AreasOfBusinessInterestEntity } from 'src/entities';

export class CreateAreasOfBusinessInterest {
  id?: string;
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  category: string;
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lineOfBusiness: any[];
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  priceRange: string;
  // @ApiProperty()
  vendorId?: string;

  userId: string;

  static fromDto(
    dto: CreateAreasOfBusinessInterest,
  ): AreasOfBusinessInterestEntity {
    const entity = new AreasOfBusinessInterestEntity();
    if (!dto) {
      return;
    }
    entity.id = dto?.id;
    entity.category = dto.category;
    entity.lineOfBusiness = dto.lineOfBusiness;
    entity.priceRange = dto.priceRange;
    entity.vendorId = dto.vendorId;
    return entity;
  }
  static fromDtos(
    dto: CreateAreasOfBusinessInterest[],
  ): AreasOfBusinessInterestEntity[] {
    return dto.map((element) => this.fromDto(element));
  }
}
export class UpdateAreasOfBusinessInterest extends CreateAreasOfBusinessInterest {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
  static fromDto(
    dto: UpdateAreasOfBusinessInterest,
  ): AreasOfBusinessInterestEntity {
    const entity = new AreasOfBusinessInterestEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.category = dto.category;
    entity.lineOfBusiness = dto.lineOfBusiness;
    entity.priceRange = dto.priceRange;
    entity.vendorId = dto.vendorId;
    return entity;
  }
  static fromDtos(
    dto: UpdateAreasOfBusinessInterest[],
  ): AreasOfBusinessInterestEntity[] {
    return dto.map((element) => this.fromDto(element));
  }
}

export class AreasOfBusinessInterestResponse extends CreateAreasOfBusinessInterest {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
  static fromEntity(
    entity: AreasOfBusinessInterestEntity,
  ): AreasOfBusinessInterestResponse {
    const response = new AreasOfBusinessInterestResponse();
    if (!entity) {
      return;
    }
    response.id = entity.id;
    response.category = entity.category;
    response.lineOfBusiness = entity.lineOfBusiness;
    response.priceRange = entity.priceRange;
    response.vendorId = entity.vendorId;
    return response;
  }
}
