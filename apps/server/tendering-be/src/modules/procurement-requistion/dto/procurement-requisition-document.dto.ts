import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
export class CreateProcurementRequisitionDocumentDto {
  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsString()
  fileType: string;

  @ApiProperty()
  @IsString()
  bucketName: string;

  @ApiProperty()
  @IsString()
  originalName: string;

  @ApiProperty()
  @IsString()
  attachmentUrl: string;

  @ApiProperty()
  @IsUUID()
  procurementRequisitionId: string;
}

export class UpdateProcurementRequisitionDocumentDto extends CreateProcurementRequisitionDocumentDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProcurementRequisitionDocumentResponseDto extends UpdateProcurementRequisitionDocumentDto {}
