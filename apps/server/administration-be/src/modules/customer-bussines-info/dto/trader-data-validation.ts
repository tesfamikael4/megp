import { ApiProperty } from '@nestjs/swagger';
import { CreateCustomerBussinesInfoDto } from './create-customer-bussines-info.dto';
import { IsArray } from 'class-validator';
import { CustomerBussinesInfo } from 'src/entities/customer-bussines-info.entity';

export class TraderDataValidation {
  @ApiProperty({ isArray: true, type: () => CustomerBussinesInfo })
  @IsArray()
  traderDataValidation: CustomerBussinesInfo[];
}
