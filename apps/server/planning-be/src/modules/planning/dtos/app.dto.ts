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
  @IsUUID()
  budgetYearId: string;

  @ApiProperty()
  @IsString()
  description: string;
}

export class UpdateAPPDto extends CreateAPPDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class CreateAPPAuto {
  @ApiProperty()
  @IsString()
  year: string;
}
export class APPResponseDto extends UpdateAPPDto {}
