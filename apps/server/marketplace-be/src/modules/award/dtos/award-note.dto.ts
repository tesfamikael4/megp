import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateAwardNoteDTO {
  @ApiProperty({ description: 'ID of the related RFX', required: true })
  @IsUUID()
  rfxId: string;

  @ApiProperty({ description: 'Name of the award note', required: true })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Procurement reference number', required: true })
  @IsString()
  @IsOptional()
  procurementReferenceNumber?: string;

  @ApiProperty({ description: 'Description of the award note', required: true })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'PR ID associated with the award note',
    required: true,
  })
  @IsString()
  prId: string;

  @ApiProperty({
    description: 'Organization Id associated with the award note',
    required: true,
  })
  @IsString()
  organizationId: string;

  @ApiProperty({
    description: 'Organization Name associated with the award note',
    required: true,
  })
  @IsString()
  organizationName: string;
}

export class UpdateAwardNoteDTO extends CreateAwardNoteDTO {
  @ApiProperty({ description: 'ID of the award note', required: true })
  @IsUUID()
  id: string;
}
