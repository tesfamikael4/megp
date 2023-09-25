import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty } from 'class-validator';
export class InsertAllDataDto {
  @ApiProperty()
  @IsNotEmpty()
  data: any;
}
