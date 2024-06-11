import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateOfferDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  rfxItemId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  rfxProductInvitationId: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  tax: number;

  solRoundId: string;

  vendorId: string;

  solRegistrationId: string;

  encryptedPrice: string;
  encryptedTax: string;
}

export class UpdateOfferDto extends CreateOfferDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
