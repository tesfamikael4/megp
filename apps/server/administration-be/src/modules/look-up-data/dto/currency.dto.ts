import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Currency } from 'src/entities/currency.entity';

export class CreateCurrencyDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  static fromDto(dto: CreateCurrencyDto): Currency {
    const entity = new Currency();
    if (!dto) {
      return null;
    }
    entity.name = dto.name;
    entity.description = dto.description;
    return entity;
  }

  static fromDtos(dto: CreateCurrencyDto[]): Currency[] {
    return dto?.map((d) => CreateCurrencyDto.fromDto(d));
  }
}

export class UpdateCurrencyDto extends CreateCurrencyDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  static fromDto(dto: UpdateCurrencyDto): Currency {
    const entity = new Currency();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.name = dto.name;
    entity.description = dto.description;
    entity.createdAt = new Date();
    return entity;
  }
}
export class CurrencyResponseDto extends UpdateCurrencyDto {
  static fromEntity(entity: Currency): CurrencyResponseDto {
    const response = new CurrencyResponseDto();
    response.id = entity.id;
    response.name = entity.name;
    response.description = entity.description;
    return response;
  }
}
