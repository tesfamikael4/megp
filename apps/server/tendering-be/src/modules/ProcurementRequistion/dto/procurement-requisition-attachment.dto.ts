import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
export class CreateProcurementRequisitionAttachmentDto {
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

export class UpdateProcurementRequisitionAttachmentDto extends CreateProcurementRequisitionAttachmentDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProcurementRequisitionAttachmentResponseDto extends UpdateProcurementRequisitionAttachmentDto {}
