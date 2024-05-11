import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRfxBidInvitationDto {
  @ApiProperty()
  @IsArray()
  productCatalogueIds: string[];
}
