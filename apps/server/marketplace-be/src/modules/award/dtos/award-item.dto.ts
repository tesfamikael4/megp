import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDecimal, IsEnum, IsString } from 'class-validator';
import { EAwardItemStatus } from 'src/utils/enums/award.enum';

export class CreateAwardItemDTO {
  vendorId: string;
  vendorName: string;
  calculatedPrice: number;
  status: EAwardItemStatus;

  @ApiProperty()
  @IsUUID()
  awardNoteId: string;

  @ApiProperty()
  @IsUUID()
  rfxItemId: string;

  @ApiProperty()
  @IsUUID()
  solRegistrationId: string;

  @ApiProperty()
  @IsUUID()
  openedOfferId: string;
}

export class UpdateAwardItemDto extends CreateAwardItemDTO {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class RespondAwardItemDto {
  @ApiProperty()
  @IsEnum(EAwardItemStatus)
  status: EAwardItemStatus;
}
