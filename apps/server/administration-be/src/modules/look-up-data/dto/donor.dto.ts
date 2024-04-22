import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
export class CreateDonorDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;
}

export class UpdateDonorDto extends CreateDonorDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class DonorResponseDto extends UpdateDonorDto {}
