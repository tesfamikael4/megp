import { IsString, IsUUID, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRfxBidQualificationDto {
  @ApiProperty()
  @IsUUID()
  rfxId: string;

  @ApiProperty()
  @IsString()
  criteria: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  order: number;
}

export class UpdateRfxBidQualificationDto extends CreateRfxBidQualificationDto {
  @ApiProperty()
  @IsString()
  id: string;
}
