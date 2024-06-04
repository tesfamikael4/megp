import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { OrgAudit } from 'src/shared/entities';

export class CompleteFinancialBidderEvaluationDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  bidderId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  itemId: string;
}

export class priceAnalysisBulkCreate {
  @ApiProperty()
  @IsArray()
  items: any[];

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  bidderId: string;
}
