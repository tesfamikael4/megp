import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class ServiceUpgradeDto {
  @ApiProperty()
  @IsNotEmpty()
  businessArea: any;
}
