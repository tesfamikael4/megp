import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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
  @IsString()
  @IsOptional()
  remark: string;
}

export class SubmitDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  bidderId: string;
}
