import { IsString, IsArray, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EInvitationStatus } from 'src/utils/enums';

export class CreateRfxBidInvitationDto {
  @ApiProperty()
  @IsArray()
  productCatalogueIds: string[];
}

export class ApplyRfxProductInvitationDto {
  @ApiProperty()
  @IsString()
  rfxItemId: string;

  @ApiProperty()
  @IsObject()
  catalogueSpecificationValues: any;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  catalogueImages: any;

  @ApiProperty()
  @IsObject()
  catalogueDeliveryValues: any;

  vendorId: string;
  vendorMetadata: any;
  solRegistrationId: string;
  status: EInvitationStatus;
}
