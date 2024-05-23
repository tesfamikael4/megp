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
  invitationId: string;

  roundId: string;

  @ApiProperty()
  @IsString()
  price: string;

  vendorId: string;

  registrationId: string;
}

export class UpdateOferDto extends CreateOfferDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
