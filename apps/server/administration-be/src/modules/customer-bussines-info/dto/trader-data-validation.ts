import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { CustomerBussinesInfo } from '@entities';

export class TraderDataValidation {
  @ApiProperty({ isArray: true, type: () => CustomerBussinesInfo })
  @IsArray()
  traderDataValidation: CustomerBussinesInfo[];
}
