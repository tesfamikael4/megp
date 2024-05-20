import {
  IsString,
  IsUUID,
  IsInt,
  Min,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRfxBidProcedureDTO {
  @ApiProperty()
  @IsUUID()
  rfxId: string;

  @ApiProperty()
  @IsInt()
  bidValidityPeriod: number;

  @ApiProperty()
  @IsString()
  submissionDeadline: string;

  @ApiProperty()
  @IsString()
  openingDate: string;

  @ApiProperty()
  @IsNumber()
  deltaPercentage: number;

  @ApiProperty()
  @IsBoolean()
  isReverseAuction: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  idleTime: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  round: number;

  @ApiProperty()
  @IsNumber()
  minimumBidDecrementPercentage: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  roundDuration: number; // in minutes
}

export class UpdateRfxBidProcedureDTO extends CreateRfxBidProcedureDTO {
  @ApiProperty()
  @IsString()
  id: string;
}
