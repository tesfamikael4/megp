import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class FetchMarketplaceProductsDto {
  @ApiProperty()
  @IsArray()
  catalogIds: string[];
}
