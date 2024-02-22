import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateTenderDto {
  @ApiProperty()
  @IsUUID()
  prId: string;
}
