import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { TradeRegistrationDatabaseEntity } from '../entities/trade-registration-database.entity';

export class TradeRegistrationDatabaseDto {
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
    dto: TradeRegistrationDatabaseDto,
  ): TradeRegistrationDatabaseEntity {
    const entity = new TradeRegistrationDatabaseEntity();
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
    createShareholdersDto: TradeRegistrationDatabaseDto[],
  ): TradeRegistrationDatabaseDto[] {
    return createShareholdersDto?.map((regDto) =>
      TradeRegistrationDatabaseDto.fromDto(regDto),
    );
  }
}
