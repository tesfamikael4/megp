import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRFXDto {
  @ApiProperty()
  @IsUUID()
  prId: string;
}

export class ChangeRFXStatusDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class UpdateRFXDto {
  @ApiProperty()
  @IsOptional()
  reviewDeadline: string;
}
