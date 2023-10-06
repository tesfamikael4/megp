import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { UOMCategory } from '../enums/enums';

export class BudgetYearCodeType {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;
  @ApiProperty()
  @IsString()
  code: string;
  @ApiProperty({ minimum: 2023, maximum: 2099 })
  fiscalYear: number;
  @ApiProperty({ format: 'date' })
  starts: Date;
  @ApiProperty({ format: 'date' })
  ends: Date;
}

export class LookupGenericType {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  description: string;
}
export class UnitType extends LookupGenericType {}
export class ProcurementMethodType extends LookupGenericType {}
export class ProcurementCategoryType extends LookupGenericType {}

export class UnitOfMeasureType {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ type: 'enum', enum: UOMCategory })
  category: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;
}
