import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateOpeningDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenderId: string;
}

export class CompleteOpeningDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenderId: string;
}
