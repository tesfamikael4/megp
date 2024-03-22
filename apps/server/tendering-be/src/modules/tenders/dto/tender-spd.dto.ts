import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateTenderSpdDto {
  @ApiProperty()
  @IsUUID()
  tenderId: string;

  @ApiProperty()
  @IsUUID()
  spdId: string;
}
