import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAPPDto {
  @ApiProperty()
  @IsString()
  planName: string;

  @ApiProperty()
  @IsString()
  budgetYear: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  status: string;
}

export class UpdateAPPDto extends CreateAPPDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class APPResponseDto extends UpdateAPPDto {}
