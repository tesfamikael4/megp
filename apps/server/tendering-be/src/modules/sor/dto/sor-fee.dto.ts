import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateSorFeesDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  itemId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  category: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  position: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  nameOfStaff: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  staffMonthRate: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  inputStaffMonth: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  rate: number;
}

export class UpdateSorFeesDto extends CreateSorFeesDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  id: string;
}

export class SorFeesResponseDto extends UpdateSorFeesDto {}
