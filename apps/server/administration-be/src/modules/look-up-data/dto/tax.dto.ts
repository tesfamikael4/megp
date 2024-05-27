import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Max, Min } from 'class-validator';

export class CreateTaxDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  shortName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Max(100)
  @Min(0)
  percentage: number;
}

export class UpdateTaxDto extends CreateTaxDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class TaxResponseDto extends UpdateTaxDto {}
