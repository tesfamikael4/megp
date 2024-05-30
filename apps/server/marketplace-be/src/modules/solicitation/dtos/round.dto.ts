import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ESolRoundStatus } from 'src/utils/enums';

export class RoundDto {
  @IsOptional()
  @IsNumber()
  round: number;

  start: Date;

  end: Date;
}
export class CreateRoundDto extends RoundDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  rfxId: string;

  status: ESolRoundStatus;
}

export class UpdateRoundDto extends CreateRoundDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
