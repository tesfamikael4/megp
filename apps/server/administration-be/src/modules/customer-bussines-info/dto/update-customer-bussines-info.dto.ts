import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateCustomerBussinesInfoDto } from './create-customer-bussines-info.dto';

export class UpdateCustomerBussinesInfoDto extends CreateCustomerBussinesInfoDto {
  @ApiProperty({
    format: 'uuid',
    required: true,
  })
  @IsUUID()
  id: string;
}
