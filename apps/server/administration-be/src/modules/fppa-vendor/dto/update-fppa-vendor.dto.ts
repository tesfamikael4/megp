import { ApiProperty } from '@nestjs/swagger';
import { CreateFppaVendorDto } from './create-fppa-vendor.dto';
import { IsUUID } from 'class-validator';

export class UpdateFppaVendorDto extends CreateFppaVendorDto {
  @ApiProperty({
    format: 'uuid',
    required: true,
  })
  @IsUUID()
  id: string;
}
