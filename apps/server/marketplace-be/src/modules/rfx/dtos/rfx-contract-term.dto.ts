import { IsString, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRfxContractTermDto {
  @ApiProperty()
  @IsUUID()
  rfxId: string;

  @ApiProperty()
  @IsString()
  term: string;

  @ApiProperty()
  @IsNumber()
  order: number;
}

export class UpdateRfxContractTermDto extends CreateRfxContractTermDto {
  @ApiProperty()
  @IsString()
  id: string;
}
