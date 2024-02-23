import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString, IsNumber } from 'class-validator';

export class CreateSorLaborsDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  itemId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  itemNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  unit: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  quantity: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  rate: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  amount: number;
}

export class UpdateSorLaborsDto extends CreateSorLaborsDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  id: string;
}

export class SorLaborsResponseDto extends UpdateSorLaborsDto {}
