import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsArray } from 'class-validator';

export class CreateBulkAcceptanceReceivesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  acceptanceNoteId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  receivingNote: string[];
}

export class CreateBulkReceiveAcceptancesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  receivingNoteId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  acceptanceNote: string[];
}
