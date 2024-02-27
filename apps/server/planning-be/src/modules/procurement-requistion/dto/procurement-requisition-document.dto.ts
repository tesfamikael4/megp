import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { FileResponseDto } from 'src/shared/domain';
export class CreateProcurementRequisitionDocumentDto {
  @ApiProperty({ type: () => FileResponseDto })
  fileInfo: FileResponseDto;
}

export class UpdateProcurementRequisitionDocumentDto extends CreateProcurementRequisitionDocumentDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProcurementRequisitionDocumentResponseDto extends UpdateProcurementRequisitionDocumentDto {}
