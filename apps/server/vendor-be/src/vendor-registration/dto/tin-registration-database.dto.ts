import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { TinRegistrationDatabaseEntity } from '../entities/tin-registration-database.entity';

export class TinRegistrationDatabaseDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  tinNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  metadata: JSON;

  /**
   * Transfer Data from DTO object to Entity object
   *
   */
  static fromDto(
    dto: TinRegistrationDatabaseDto,
  ): TinRegistrationDatabaseEntity {
    const entity = new TinRegistrationDatabaseEntity();
    if (!dto) {
      return;
    }
    entity.id = dto?.id;
    entity.tinNumber = dto.tinNumber;
    entity.metadata = dto.metadata;
    return entity;
  }

  /**
   * Transfer list of DTO object to Entity  list
   *
   */
  static fromDtos(
    createShareholdersDto: TinRegistrationDatabaseDto[],
  ): TinRegistrationDatabaseEntity[] {
    return createShareholdersDto?.map((regDto) =>
      TinRegistrationDatabaseDto.fromDto(regDto),
    );
  }
}
