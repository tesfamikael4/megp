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

  solRoundId: string;

  vendorId: string;

  solRegistrationId: string;

  encryptedPrice: string;
}

export class UpdateOferDto extends CreateOfferDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
