import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOpeningDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenderId: string;
}
