import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateDistrictDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  regionId: string;
}

export class UpdateDistrictDto extends CreateDistrictDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class DistrictResponseDto extends UpdateDistrictDto {}
