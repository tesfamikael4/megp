import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class InsertAllDataDto {
  @ApiProperty()
  @IsNotEmpty()
  data: any;
}
