import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTenderDto {
  @ApiProperty()
  @IsUUID()
  prId: string;
}

export class ChangeTenderStatusDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class GenerateTenderDocumentDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ReAdvertiseTenderDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class InviteTenderParticipantDto {
  @ApiProperty()
  @IsUUID()
  tenderId: string;

  @ApiProperty({ isArray: true, type: () => BidderInfo })
  @IsArray()
  bidders: BidderInfo[];
}

export class BidderInfo {
  @ApiProperty()
  @IsUUID()
  bidderId: string;

  @ApiProperty()
  @IsString()
  bidderName: string;
}
