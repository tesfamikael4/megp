import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRegionDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

export class UpdateRegionDto extends CreateRegionDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class RegionResponseDto extends UpdateRegionDto {}
