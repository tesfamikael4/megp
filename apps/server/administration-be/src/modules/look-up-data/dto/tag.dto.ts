import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTagDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  shortName: string;

  @ApiProperty()
  @IsNotEmpty()
  code: string;
}

export class UpdateTagDto extends CreateTagDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class TagResponseDto extends UpdateTagDto {}
