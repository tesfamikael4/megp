import {
  IsString,
  IsUUID,
  IsNumber,
  IsEnum,
  IsJSON,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { POItemStatus } from 'src/utils/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePOItemDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsUUID()
  purchaseOrderId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  quantity: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  price: number;

  @ApiProperty()
  @IsString()
  uom: string;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsJSON()
  specification: any;
}
export class UpdatePoItemDto extends CreatePOItemDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class GetPoItemDto extends CreatePOItemDto {}
