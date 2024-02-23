import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { Audit } from 'src/shared/entities';

export class CreateSorIncidentalCostDto extends Audit {
  @IsNotEmpty()
  @IsString()
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
  country: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  rate: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  amount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  currency: string;
}

export class UpdateSorIncidentalCostDto extends CreateSorIncidentalCostDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  id: string;
}

export class SorIncidentalCostResponseDto extends UpdateSorIncidentalCostDto {}
