import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsUUID } from 'class-validator';
import { VendorsEntity } from '../entities/vendors.entity';
import { CreateBusinessCategoryDto } from './business-category.dto';
import { CreateCustomCategoryDto } from './custom-category.dto';

export class InsertAllDataDto {
  @ApiProperty()
  @IsNotEmpty()
  data: any;
}
