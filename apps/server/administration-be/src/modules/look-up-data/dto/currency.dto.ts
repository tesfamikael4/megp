import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
export class CreateCurrencyDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  abbreviation: string;
}

export class UpdateCurrencyDto extends CreateCurrencyDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class CurrencyResponseDto extends UpdateCurrencyDto {}
