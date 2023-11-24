import { ApiProperty } from '@nestjs/swagger';
import { CreateNcicVendorDto } from './create-ncic-vendor.dto';
import { IsUUID } from 'class-validator';

export class UpdateNcicVendorDto extends CreateNcicVendorDto {
  @ApiProperty({
    format: 'uuid',
    required: true,
  })
  @IsUUID()
  id: string;
}
