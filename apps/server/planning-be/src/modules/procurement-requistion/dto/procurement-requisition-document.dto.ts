import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { FileUploadDto } from 'src/shared/min-io';
export class CreateProcurementRequisitionDocumentDto {
  @ApiProperty()
  @IsUUID()
  procurementRequisitionId: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ isArray: false, type: () => FileUploadDto })
  fileInfo: FileUploadDto;
}

export class UpdateProcurementRequisitionDocumentDto extends CreateProcurementRequisitionDocumentDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProcurementRequisitionDocumentResponseDto extends UpdateProcurementRequisitionDocumentDto {}
