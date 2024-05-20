import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class RoundDto {
  @IsOptional()
  @IsNumber()
  round: number;

  @ApiProperty()
  start: string;

  @ApiProperty()
  end: string;
}
export class CreateRoundDto extends RoundDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  rfxId: string;
}

export class UpdateRoundDto extends CreateRoundDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
