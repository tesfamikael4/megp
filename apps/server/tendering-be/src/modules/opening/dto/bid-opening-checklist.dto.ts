import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBidOpeningCheckList {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenderId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  spdOpeningChecklistId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  bidderId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  checked: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isTeamLead: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  remark: string;
}

export class SubmitChecklistDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenderId: string;

  @ApiProperty()
  @IsNotEmpty()
  isTeamLead: boolean;
}
export class CompleteBidChecklistDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenderId: string;
}
